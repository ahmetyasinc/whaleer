export async function POST(request) {
    const body = await request.json();
  
    const webhookUrl = "https://script.google.com/macros/s/AKfycbwTIEbiY5F1UB-9kFiCKma0VmLMdthoG_Ct4GwXF2ml2OH_K6zSFWsKZECiH-KuNNgqNQ/exec"; // kendi webhook’unuz
  
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
  
      if (!res.ok) {
        return new Response(JSON.stringify({ error: 'Google Sheets gönderimi başarısız' }), {
          status: 500,
        });
      }
  
      return new Response(JSON.stringify({ message: 'Başarıyla kaydedildi' }), {
        status: 200,
      });
    } catch (err) {
      console.error('API route hatası:', err);
      return new Response(JSON.stringify({ error: 'Sunucu hatası' }), {
        status: 500,
      });
    }
  }
  