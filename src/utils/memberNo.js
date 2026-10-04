// Public page a member card's QR code points to (opens in any phone camera)
export const verifyUrl = (memberNo) => `${window.location.origin}/member/${memberNo}`

// Pulls "PAIRA-0001" out of scanned QR text (a full verify URL or the bare number)
export const memberNoFromText = (text) => String(text ?? '').match(/PAIRA-\d{4,}/i)?.[0]?.toUpperCase() ?? null
