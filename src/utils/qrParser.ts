export type QRType = 'UPI' | 'URL' | 'WIFI' | 'VCARD' | 'EMAIL' | 'PHONE' | 'TEXT';

export interface ParsedQRData {
  type: QRType;
  raw: string;
  data: any;
}

/**
 * Parse QR code content and classify it
 */
export function parseQRCodeContent(content: string): ParsedQRData {
  const trimmedContent = content.trim();

  // UPI Payment QR
  if (trimmedContent.toLowerCase().startsWith('upi://pay?')) {
    return {
      type: 'UPI',
      raw: trimmedContent,
      data: parseUPIContent(trimmedContent),
    };
  }

  // URL (http/https)
  if (/^https?:\/\//i.test(trimmedContent)) {
    return {
      type: 'URL',
      raw: trimmedContent,
      data: { url: trimmedContent },
    };
  }

  // WiFi QR
  if (/^WIFI:/i.test(trimmedContent)) {
    return {
      type: 'WIFI',
      raw: trimmedContent,
      data: parseWiFiContent(trimmedContent),
    };
  }

  // vCard
  if (/^BEGIN:VCARD/i.test(trimmedContent)) {
    return {
      type: 'VCARD',
      raw: trimmedContent,
      data: parseVCardContent(trimmedContent),
    };
  }

  // Email
  if (/^mailto:/i.test(trimmedContent)) {
    return {
      type: 'EMAIL',
      raw: trimmedContent,
      data: { email: trimmedContent.replace(/^mailto:/i, '') },
    };
  }

  // Phone
  if (/^tel:/i.test(trimmedContent)) {
    return {
      type: 'PHONE',
      raw: trimmedContent,
      data: { phone: trimmedContent.replace(/^tel:/i, '') },
    };
  }

  // Default to TEXT
  return {
    type: 'TEXT',
    raw: trimmedContent,
    data: { text: trimmedContent },
  };
}

/**
 * Parse UPI payment QR content
 */
function parseUPIContent(upiString: string) {
  const url = new URL(upiString);
  const params = url.searchParams;

  return {
    pa: params.get('pa') || '', // Payee address
    pn: params.get('pn') || '', // Payee name
    am: params.get('am') || '', // Amount
    tn: params.get('tn') || '', // Transaction note
    cu: params.get('cu') || 'INR', // Currency
    mc: params.get('mc') || '', // Merchant code
    tr: params.get('tr') || '', // Transaction reference
  };
}

/**
 * Parse WiFi QR content
 * Format: WIFI:T:WPA;S:MyNetwork;P:MyPassword;H:false;;
 */
function parseWiFiContent(wifiString: string) {
  const regex = /WIFI:T:([^;]*);S:([^;]*);P:([^;]*);H:([^;]*);/i;
  const match = wifiString.match(regex);

  if (match) {
    return {
      security: match[1] || 'NONE',
      ssid: match[2] || '',
      password: match[3] || '',
      hidden: match[4] === 'true',
    };
  }

  return {
    security: 'NONE',
    ssid: '',
    password: '',
    hidden: false,
  };
}

/**
 * Parse vCard content
 */
function parseVCardContent(vcardString: string) {
  const lines = vcardString.split(/\r?\n/);
  const data: any = {};

  lines.forEach((line) => {
    if (line.startsWith('FN:')) {
      data.name = line.substring(3);
    } else if (line.startsWith('TEL:')) {
      data.phone = line.substring(4);
    } else if (line.startsWith('EMAIL:')) {
      data.email = line.substring(6);
    } else if (line.startsWith('ORG:')) {
      data.organization = line.substring(4);
    } else if (line.startsWith('URL:')) {
      data.url = line.substring(4);
    }
  });

  return data;
}

