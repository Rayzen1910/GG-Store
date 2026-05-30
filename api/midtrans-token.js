export default async function handler(req, res) {
  // Hanya menerima metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const payload = req.body;
    
    // Mengambil server key dari environment variables Vercel
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    
    if (!serverKey) {
      return res.status(400).json({ 
        error: 'MIDTRANS_SERVER_KEY is not configured on Vercel.' 
      });
    }

    const authHeader = 'Basic ' + Buffer.from(serverKey + ':').toString('base64');
    const midtransApiUrl = 'https://app.sandbox.midtrans.com/snap/v1/transactions';

    // Mengirim permintaan ke server Midtrans Sandbox
    const midtransRes = await fetch(midtransApiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: 'GG-' + Math.round(Math.random() * 10000000) + '-' + Date.now(),
          gross_amount: Math.round(payload.amount || 3800000),
          currency: 'IDR'
        },
        credit_card: {
          secure: true
        },
        customer_details: {
          first_name: payload.firstName || 'John',
          last_name: payload.lastName || 'Builder',
          email: payload.email || 'john@ggstore.com',
          phone: payload.phone || '+628110000000'
        }
      })
    });

    const midtransData = await midtransRes.json();
    return res.status(midtransRes.status).json(midtransData);

  } catch (error) {
    console.error('Midtrans API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
