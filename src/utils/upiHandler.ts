import * as IntentLauncher from "expo-intent-launcher";
import { Alert, Linking, Platform, ToastAndroid } from "react-native";
import upiApps from "./upi-apps.json";

export interface UPIApp {
  name: string;
  packageName: string;
  icon: string;
  playStoreUrl: string;
  intentUrl: string;
}

export type UPIParamValue = string | number | null | undefined;

export interface UPIIntentParams {
  pa: string;
  pn?: UPIParamValue;
  am?: UPIParamValue;
  tn?: UPIParamValue;
  cu?: UPIParamValue;
  tr?: UPIParamValue;
  tid?: UPIParamValue;
  mc?: UPIParamValue;
  url?: UPIParamValue;
  mode?: UPIParamValue;
  orgid?: UPIParamValue;
  purposeCode?: UPIParamValue;
  minimumAmount?: UPIParamValue;
  invoiceNo?: UPIParamValue;
  [key: string]: UPIParamValue;
}

export interface FetchUPIAppsOptions {
  forceRefresh?: boolean;
  includeFallback?: boolean;
  limit?: number;
  concurrency?: number;
  signal?: AbortSignal;
}

export type OpenUPIFallbackReason =
  | "APP_NOT_INSTALLED"
  | "DEEPLINK_REJECTED"
  | "NO_SUPPORTED_APP";

export interface OpenUPIFallbackContext {
  reason: OpenUPIFallbackReason;
  attemptedUrls: string[];
  targetApp?: UPIApp;
}

export interface OpenUPIAppOptions {
  params?: Partial<UPIIntentParams>;
  fallbackToStore?: boolean;
  fallbackToWeb?: boolean;
  fallbackUrl?: string;
  preferNativeDeepLink?: boolean;
  onFallback?: (context: OpenUPIFallbackContext) => void;
}

const GOOGLE_PLAY_SEARCH_URL =
  "https://play.google.com/store/search?hl=en&c=apps&q=";
const NPCI_LIVE_MEMBERS_URL =
  "https://www.npci.org.in/what-we-do/upi/live-members";
const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_FETCH_LIMIT = 16;
const DEFAULT_CONCURRENCY = 3;

export const DEFAULT_UPI_APPS: UPIApp[] = upiApps as UPIApp[];

let cachedUpiApps: UPIApp[] | null = null;
let inflightFetch: Promise<UPIApp[]> | null = null;

type CleanupFn = () => void;

const DEFAULT_HEADERS: Record<string, string> = {
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "en-US,en;q=0.9",
  ...(Platform.OS !== "web"
    ? {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      }
    : {}),
};

const getIOSScheme = (packageName: string): string => {
  const schemeMap: Record<string, string> = {
    "com.google.android.apps.nbu.paisa.user": "googlepaytez://",
    "com.phonepe.app": "phonepe://",
    "com.paytm.android": "paytmmp://",
    "com.airtel.payments.app": "airtelpaymentsbank://",
    "com.amazon.venezia": "amazonpay://",
    "net.one97.paytm": "paytm://",
    "com.mobikwik_new": "mobikwik://",
  };
  return schemeMap[packageName] || "upi://";
};

const getWebDeepLink = (packageName: string): string => {
  const webMap: Record<string, string> = {
    "com.google.android.apps.nbu.paisa.user": "https://pay.google.com",
    "com.phonepe.app": "https://www.phonepe.com",
    "com.paytm.android": "https://paytm.me",
    "com.airtel.payments.app": "https://www.airtelpaymentsbank.com",
    "com.amazon.venezia": "https://www.amazon.in/amazonpay",
  };
  return webMap[packageName] || "https://upi.npci.org.in/";
};

const linkAbortSignals = (
  controller: AbortController,
  external?: AbortSignal
): CleanupFn => {
  if (!external) return () => {};
  if (external.aborted) {
    controller.abort(external.reason);
    return () => {};
  }
  const abortHandler = () => controller.abort(external.reason);
  external.addEventListener("abort", abortHandler, { once: true });
  return () => external.removeEventListener("abort", abortHandler);
};

const fetchText = async (
  url: string,
  {
    timeout = DEFAULT_TIMEOUT_MS,
    signal,
    headers,
  }: { timeout?: number; signal?: AbortSignal; headers?: HeadersInit } = {}
): Promise<string> => {
  const controller = new AbortController();
  const detach = linkAbortSignals(controller, signal);
  let timer: ReturnType<typeof setTimeout> | undefined;
  if (timeout > 0) timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      headers: { ...DEFAULT_HEADERS, ...(headers as Record<string, string>) },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } finally {
    if (timer) clearTimeout(timer);
    detach();
  }
};

const extractNpcNames = (html: string): string[] => {
  const matches = [...html.matchAll(/<li[^>]*>(.*?)<\/li>/gi)]
    .map((match) => match[1].replace(/<[^>]+>/g, "").trim())
    .filter(Boolean);
  return [...new Set(matches)];
};

const fetchNpcNames = async (
  options: Pick<FetchUPIAppsOptions, "signal">
): Promise<string[]> => {
  const fallback = [
    "Google Pay",
    "PhonePe",
    "Paytm",
    "BHIM",
    "Amazon Pay",
    "WhatsApp",
    "Cred",
    "Mobikwik",
    "Freecharge",
    "Airtel Payments Bank",
    "Truecaller",
    "Ola Money",
    "Slice",
    "JioPay",
    "Bajaj Pay UPI",
  ];
  try {
    const html = await fetchText(NPCI_LIVE_MEMBERS_URL, {
      signal: options.signal,
    });
    const names = extractNpcNames(html);
    return names.length ? names : fallback;
  } catch {
    return fallback;
  }
};

const extractPackageInfo = (
  html: string
): { packageName: string | null; icon: string | null } => {
  const pkgMatch = html.match(/\/store\/apps\/details\?id=([^"&]+)/);
  const packageName = pkgMatch ? pkgMatch[1] : null;
  const iconMatch = html.match(
    /https:\/\/play-lh\.googleusercontent\.com\/[a-zA-Z0-9_-]+=[a-z0-9]+/
  );
  const icon = iconMatch ? iconMatch[0] : null;
  return { packageName, icon };
};

const searchPlayStore = async (
  appName: string,
  options: Pick<FetchUPIAppsOptions, "signal">
): Promise<UPIApp | null> => {
  try {
    const encodedName = encodeURIComponent(appName);
    const searchUrl = `${GOOGLE_PLAY_SEARCH_URL}${encodedName}`;
    const html = await fetchText(searchUrl, { signal: options.signal });
    const { packageName, icon } = extractPackageInfo(html);
    if (!packageName) return null;
    return {
      packageName,
      name: appName,
      icon: icon ?? "",
      playStoreUrl: `https://play.google.com/store/apps/details?id=${packageName}`,
      intentUrl: `intent://${packageName}/#Intent;scheme=package;end`,
    };
  } catch {
    return null;
  }
};

const asyncPool = async <T, R>(
  limit: number,
  items: readonly T[],
  task: (item: T) => Promise<R>
): Promise<R[]> => {
  const results: Promise<R>[] = [];
  const executing: Promise<void>[] = [];
  for (const item of items) {
    const promise = Promise.resolve().then(() => task(item));
    results.push(promise);
    if (limit <= items.length) {
      const exec = promise
        .then(() => undefined)
        .finally(() => {
          const index = executing.indexOf(exec);
          if (index >= 0) executing.splice(index, 1);
        });
      executing.push(exec);
      if (executing.length >= limit) await Promise.race(executing);
    }
  }
  return Promise.all(results);
};

const dedupeApps = (apps: UPIApp[]): UPIApp[] => {
  const map = new Map<string, UPIApp>();
  apps.forEach((app) => {
    if (!map.get(app.packageName)) map.set(app.packageName, app);
  });
  return [...map.values()];
};

const fetchAppsFromSource = async (
  options: FetchUPIAppsOptions
): Promise<UPIApp[]> => {
  const names = await fetchNpcNames(options);
  const limit = options.limit ?? DEFAULT_FETCH_LIMIT;
  const subset = names.slice(0, limit);
  const concurrency = Math.max(1, options.concurrency ?? DEFAULT_CONCURRENCY);
  const found = await asyncPool(concurrency, subset, (name) =>
    searchPlayStore(name, options)
  );
  const refined = dedupeApps(found.filter(Boolean) as UPIApp[]);
  return refined;
};

export const getCachedUPIApps = (): UPIApp[] => {
  if (cachedUpiApps && cachedUpiApps.length) return cachedUpiApps;
  return DEFAULT_UPI_APPS;
};

export const clearUPIAppsCache = () => {
  cachedUpiApps = null;
  inflightFetch = null;
};

export async function fetchUPIApps(
  options: FetchUPIAppsOptions = {}
): Promise<UPIApp[]> {
  const includeFallback = options.includeFallback !== false;
  if (!options.forceRefresh && cachedUpiApps && cachedUpiApps.length)
    return cachedUpiApps;
  if (inflightFetch && !options.forceRefresh) return inflightFetch;
  const fetchPromise = fetchAppsFromSource(options)
    .then((apps) => {
      const result =
        apps.length || !includeFallback
          ? apps
          : dedupeApps([...DEFAULT_UPI_APPS]);
      cachedUpiApps = result.length
        ? result
        : includeFallback
        ? [...DEFAULT_UPI_APPS]
        : [];
      return cachedUpiApps;
    })
    .catch((error) => {
      if (!includeFallback) throw error;
      cachedUpiApps =
        cachedUpiApps && cachedUpiApps.length
          ? cachedUpiApps
          : [...DEFAULT_UPI_APPS];
      return cachedUpiApps;
    })
    .finally(() => {
      if (inflightFetch === fetchPromise) inflightFetch = null;
    });
  inflightFetch = fetchPromise;
  return fetchPromise;
}

const buildAndroidDeepLink = (
  packageName: string,
  params: string,
  preferNative?: boolean
): string => {
  if (!preferNative) return `upi://pay?${params}`;
  const map: Record<string, string> = {
    "com.google.android.apps.nbu.paisa.user": `googlepay://upi/pay?${params}`,
    "com.phonepe.app": `phonepe://upi/pay?${params}`,
    "com.paytm.android": `paytmmp://upi/pay?${params}`,
    "com.airtel.payments.app": `airtelpaymentsbank://upi/pay?${params}`,
    "com.amazon.venezia": `amazonpay://upi/pay?${params}`,
    "net.one97.paytm": `paytm://upi/pay?${params}`,
    "com.mobikwik_new": `mobikwik://upi/pay?${params}`,
  };
  return map[packageName] || `upi://pay?${params}`;
};

const normalizeParamValue = (value: UPIParamValue): string | null => {
  if (value === undefined || value === null) return null;
  const str = String(value).trim();
  if (!str || str.toLowerCase() === "undefined" || str.toLowerCase() === "null")
    return null;
  return str;
};

const mergeUPIParams = (
  upiUrl: string,
  overrides?: Partial<UPIIntentParams>
): string => {
  if (!overrides) return upiUrl;
  const [base, query = ""] = upiUrl.split("?");
  const params = new URLSearchParams(query);
  Object.entries(overrides).forEach(([key, value]) => {
    const normalized = normalizeParamValue(value);
    if (normalized === null) params.delete(key);
    else params.set(key, normalized);
  });
  const serialized = params.toString();
  return `${base}?${serialized}`;
};

const openCandidateUrls = async (urls: string[]): Promise<boolean> => {
  for (const url of urls) {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        return true;
      }
      if (Platform.OS === "android" && url.startsWith("intent://")) {
        await Linking.openURL(url);
        return true;
      }
    } catch {
      try {
        await Linking.openURL(url);
        return true;
      } catch {}
    }
  }
  return false;
};

export async function openUPIApp(
  upiUrl: string,
  appName?: string,
  options: OpenUPIAppOptions = {}
): Promise<boolean> {
  if (!upiUrl || !upiUrl.startsWith("upi://")) return false;
  const mergedUrl = mergeUPIParams(upiUrl, options.params);
  const paramsString = mergedUrl.includes("?") ? mergedUrl.split("?")[1] : "";
  const selectedApp = appName
    ? getCachedUPIApps().find((app) => app.name === appName)
    : undefined;

  try {
    if (Platform.OS === "ios") {
      const candidateUrls: string[] = [];
      if (selectedApp) {
        const iosScheme = getIOSScheme(selectedApp.packageName);
        const iosUrl = `${iosScheme}${
          paramsString ? `upi/pay?${paramsString}` : ""
        }`;
        candidateUrls.push(iosUrl);
      }
      candidateUrls.push(mergedUrl);
      const opened = await openCandidateUrls(candidateUrls);
      if (!opened && selectedApp && options.fallbackToStore !== false) {
        Alert.alert(
          "App Not Installed",
          `${selectedApp.name} is not installed. Open App Store?`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open App Store",
              onPress: () => Linking.openURL(selectedApp.playStoreUrl),
            },
          ]
        );
        options.onFallback?.({
          reason: "APP_NOT_INSTALLED",
          attemptedUrls: candidateUrls,
          targetApp: selectedApp,
        });
      }
      return opened;
    }

    if (Platform.OS === "android") {
      const candidateUrls: string[] = [];
      if (selectedApp) {
        const androidDeepLink = buildAndroidDeepLink(
          selectedApp.packageName,
          paramsString,
          options.preferNativeDeepLink
        );
        candidateUrls.push(androidDeepLink);
        candidateUrls.push(selectedApp.intentUrl);
      }
      candidateUrls.push(mergedUrl);
      candidateUrls.push(
        `intent://upi/pay?${paramsString}#Intent;package=${selectedApp?.packageName};end`
      );

      let opened = await openCandidateUrls(candidateUrls);

      if (!opened && selectedApp) {
        try {
          await IntentLauncher.startActivityAsync(
            "android.intent.action.VIEW",
            {
              data: `upi://pay?${paramsString}`,
              packageName: selectedApp.packageName,
            }
          );
          opened = true;
        } catch {
          if (options.fallbackToStore !== false) {
            try {
              await Linking.openURL(selectedApp.playStoreUrl);
            } catch {
              ToastAndroid.show(
                `${selectedApp.name} not installed`,
                ToastAndroid.SHORT
              );
            }
          } else {
            ToastAndroid.show(
              `${selectedApp.name} not available`,
              ToastAndroid.SHORT
            );
          }
          options.onFallback?.({
            reason: "APP_NOT_INSTALLED",
            attemptedUrls: candidateUrls,
            targetApp: selectedApp,
          });
          return false;
        }
      }

      if (!opened) {
        options.onFallback?.({
          reason: "NO_SUPPORTED_APP",
          attemptedUrls: candidateUrls,
        });
        ToastAndroid.show("No UPI app installed", ToastAndroid.SHORT);
      }

      return opened;
    }

    if (Platform.OS === "web") {
      const target = selectedApp
        ? getWebDeepLink(selectedApp.packageName)
        : options.fallbackUrl ||
          "https://www.npci.org.in/what-we-do/upi/live-members";
      window.open(target, "_blank");
      if (!selectedApp && options.fallbackToWeb === false) {
        options.onFallback?.({
          reason: "NO_SUPPORTED_APP",
          attemptedUrls: [target],
        });
        return false;
      }
      return true;
    }

    return false;
  } catch {
    const attemptedUrls = selectedApp
      ? [mergedUrl, selectedApp.intentUrl]
      : [mergedUrl];
    options.onFallback?.({
      reason: "DEEPLINK_REJECTED",
      attemptedUrls,
      targetApp: selectedApp,
    });
    return false;
  }
}

export function formatAmount(
  amount: string | number,
  currency: string = "INR"
): string {
  const num = typeof amount === "number" ? amount : parseFloat(amount);
  if (Number.isNaN(num)) return "Invalid amount";
  return currency === "INR"
    ? `₹${num.toFixed(2)}`
    : `${currency} ${num.toFixed(2)}`;
}

export const isValidUPIId = (upiId: string): boolean =>
  /^[\w.-]+@[\w.-]+$/.test(upiId);

export function buildUPIUrl(params: UPIIntentParams): string {
  const { pa } = params;
  if (!pa) throw new Error("Payee address (pa) is required to build a UPI URL");
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    const normalized = normalizeParamValue(value);
    if (normalized !== null) searchParams.set(key, normalized);
  });
  if (!searchParams.has("cu")) searchParams.set("cu", "INR");
  return `upi://pay?${searchParams.toString()}`;
}

export async function openUPIAppWithAmount(
  upiId: string,
  amount: string | number,
  description: string,
  appName?: string,
  options: Omit<OpenUPIAppOptions, "params"> & {
    payerName?: string;
    additionalParams?: Partial<UPIIntentParams>;
  } = {}
): Promise<boolean> {
  try {
    const payerName = options.payerName ?? "User";

    const upiParams: UPIIntentParams = {
      pa: upiId,
      pn: payerName,
      am: amount.toString(),
      tn: description,
      cu: "INR",
      ...options.additionalParams,
    };

    const upiUrl = buildUPIUrl(upiParams);
    const paramsString = upiUrl.includes("?") ? upiUrl.split("?")[1] : "";

    const allApps = getCachedUPIApps();
    const selectedApp = appName
      ? allApps.find((app) => app.name === appName)
      : undefined;

    const candidateUrls: string[] = [];

    if (selectedApp) {
      if (Platform.OS === "android") {
        candidateUrls.push(
          buildAndroidDeepLink(
            selectedApp.packageName,
            paramsString,
            options.preferNativeDeepLink
          )
        );
        candidateUrls.push(selectedApp.intentUrl);
      } else if (Platform.OS === "ios") {
        const iosScheme = getIOSScheme(selectedApp.packageName);
        candidateUrls.push(`${iosScheme}upi/pay?${paramsString}`);
      }
      candidateUrls.push(upiUrl);
    } else {
      allApps.forEach((app) => {
        if (Platform.OS === "android") {
          candidateUrls.push(
            buildAndroidDeepLink(
              app.packageName,
              paramsString,
              options.preferNativeDeepLink
            )
          );
          candidateUrls.push(app.intentUrl);
        } else if (Platform.OS === "ios") {
          const iosScheme = getIOSScheme(app.packageName);
          candidateUrls.push(`${iosScheme}upi/pay?${paramsString}`);
        }
        candidateUrls.push(upiUrl);
      });
    }

    const opened = await openCandidateUrls(candidateUrls);

    if (opened) return true;

    if (selectedApp && Platform.OS === "android") {
      try {
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: `upi://pay?${paramsString}`,
          packageName: selectedApp.packageName,
        });
        return true;
      } catch {
        if (options.fallbackToStore !== false) {
          try {
            await Linking.openURL(selectedApp.playStoreUrl);
          } catch {
            ToastAndroid.show(
              `${selectedApp.name} not installed`,
              ToastAndroid.SHORT
            );
          }
        } else {
          ToastAndroid.show(
            `${selectedApp.name} not available`,
            ToastAndroid.SHORT
          );
        }
        options.onFallback?.({
          reason: "APP_NOT_INSTALLED",
          attemptedUrls: candidateUrls,
          targetApp: selectedApp,
        });
        return false;
      }
    }

    if (
      !opened &&
      Platform.OS === "ios" &&
      selectedApp &&
      options.fallbackToStore !== false
    ) {
      Alert.alert(
        "App Not Installed",
        `${selectedApp.name} is not installed. Open App Store?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open App Store",
            onPress: () => Linking.openURL(selectedApp.playStoreUrl),
          },
        ]
      );
      options.onFallback?.({
        reason: "APP_NOT_INSTALLED",
        attemptedUrls: candidateUrls,
        targetApp: selectedApp,
      });
      return false;
    }

    if (!opened && Platform.OS === "web") {
      const target = selectedApp
        ? getWebDeepLink(selectedApp.packageName)
        : options.fallbackUrl ?? NPCI_LIVE_MEMBERS_URL;
      window.open(target, "_blank");
      options.onFallback?.({
        reason: "NO_SUPPORTED_APP",
        attemptedUrls: [target],
        targetApp: selectedApp,
      });
      return true;
    }

    options.onFallback?.({
      reason: "NO_SUPPORTED_APP",
      attemptedUrls: candidateUrls,
      targetApp: selectedApp,
    });
    return false;
  } catch (error) {
    console.error("Error launching UPI app:", error);
    options.onFallback?.({
      reason: "DEEPLINK_REJECTED",
      attemptedUrls: [],
      targetApp: undefined,
    });
    return false;
  }
}
