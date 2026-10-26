// Client-side QR code generation (via the local `qrcode` package).
// QRs encode the shop's own URL / WhatsApp number — no server or API call needed.
import QRCode from 'qrcode'

function origin() {
  return typeof window !== 'undefined' ? window.location.origin : ''
}

function targetFor(type, data) {
  switch (type) {
    case 'shop':
      return `${origin()}/shop/${data}`
    case 'whatsapp':
      return `https://wa.me/${String(data || '').replace(/[^0-9]/g, '')}`
    case 'review': {
      const num = String(data.phone || '').replace(/[^0-9]/g, '')
      const text = encodeURIComponent(`Hi, I'd like to share feedback about ${data.shop || 'your shop'}`)
      return `https://wa.me/${num}?text=${text}`
    }
    default:
      return ''
  }
}

export async function generateQRCode(type, data) {
  const qrData = targetFor(type, data)
  if (!qrData) {
    console.error('QR Code Error: invalid type', type)
    return null
  }
  try {
    const qrCode = await QRCode.toDataURL(qrData, { width: 300, margin: 2 })
    return { success: true, qrCode, data: qrData }
  } catch (error) {
    console.error('QR Code Error:', error)
    return null
  }
}
