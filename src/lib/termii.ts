const DEFAULT_BASE_URL = "https://api.ng.termii.com";

export function isTermiiConfigured(): boolean {
  return Boolean(process.env.TERMII_API_KEY && process.env.TERMII_SENDER_ID);
}

export function termiiPhoneFromE164(phone: string): string {
  return phone.replace(/\D/g, "");
}

export async function sendTermiiSms(to: string, message: string): Promise<void> {
  const apiKey = process.env.TERMII_API_KEY;
  const senderId = process.env.TERMII_SENDER_ID;

  if (!apiKey || !senderId) {
    throw new Error("Termii is not configured");
  }

  const baseUrl = (process.env.TERMII_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, "");
  const channel = process.env.TERMII_CHANNEL ?? "dnd";

  const res = await fetch(`${baseUrl}/api/sms/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      to,
      from: senderId,
      sms: message,
      type: "plain",
      channel,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    code?: string;
    message?: string;
  };

  if (!res.ok || data.code !== "ok") {
    throw new Error(data.message ?? `Termii request failed (${res.status})`);
  }
}
