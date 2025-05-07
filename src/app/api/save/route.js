export async function POST(request) {
    const body = await request.json();
  
    const webhookUrl = "https://script.google.com/macros/s/AKfycbxTL1jzwwgtPkoEgE2ULwthGrDw0T03sBea8ZzmpN6Ut1WsOzfd-VkYYbxQ1FPnm1Dy/exec"; // kendi webhook’unuz
  
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
  