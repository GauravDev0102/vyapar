// API route for QR code generation
import { NextApiRequest, NextApiResponse } from 'next';
import QRCode from 'qrcode';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, data } = req.query;

    if (!type || !data) {
      return res.status(400).json({ error: 'Missing type or data parameters' });
    }

    let qrData = '';

    switch (type) {
      case 'shop':
        qrData = `https://vyapar.vercel.app/shop/${data}`;
        break;
      case 'whatsapp':
        qrData = `https://wa.me/${data}`;
        break;
      case 'review':
        qrData = `https://vyapar.vercel.app/review/${data}`;
        break;
      default:
        return res.status(400).json({ error: 'Invalid type' });
    }

    const qrCode = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    return res.status(200).json({
      success: true,
      qrCode,
      data: qrData,
    });
  } catch (error) {
    console.error('QR Code Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
