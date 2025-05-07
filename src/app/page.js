'use client';

import { useSurveyStore } from '@/store/surveyStore';

export default function SurveyPage() {
  const { currentQuestionIndex, answers, setAnswer, nextQuestion, prevQuestion } = useSurveyStore();

  const handleChange = (key, value) => {
    setAnswer(key, value);
  };

  const questions = [
    {
      key: 'q1',
      type: 'select',
      text: '1. Yaş aralığınızı seçiniz:',
      options: ['18-24', '25-34', '35-44', '45+'],
    },
    {
      key: 'q2',
      type: 'input',
      text: '2. Yatırım için ayrılmış bütçeniz nedir? (TL cinsinden)',
    },
    {
      key: 'q3',
      type: 'radio',
      text: '3. Finansal piyasalarda (kripto, hisse, forex vb.) aktif misiniz?',
      options: ['Evet', 'Hayır'],
      subQuestions: [
        {
          key: 'q3_1',
          type: 'checkbox',
          text: '3.1. Hangi yatırım araçlarını kullanıyorsunuz?',
          options: [
            'Kripto para borsaları',
            'Hisse senetleri',
            'Altın, gümüş gibi değerli madenler',
            'Forex (döviz) piyasası',
            'Diğer',
          ],
        },
        {
          key: 'q3_2',
          type: 'radio',
          text: '3.2. Ortalama aylık işlem sıklığınız?',
          options: ['0-20', '21-100', '100+'],
        },
      ],
      condition: (value) => value === 'Evet',
    },
    {
      key: 'q4',
      type: 'radio',
      text: '4. Alım satım stratejileri geliştiriyor musunuz veya geliştirmek ister misiniz?',
      options: ['Evet', 'Hayır', 'Kısmen'],
      subQuestions: [
        {
          key: 'q4_1',
          type: 'checkbox',
          text: '4.1. Hangi programlama dillerinde strateji yazma deneyiminiz var?',
          options: [
            'Python',
            'C, C++, C#, Java',
            'Pine Script (TradingView)',
            'Diğer',
          ],
        },
        {
          key: 'q4_2',
          type: 'checkbox',
          text: '4.2. Stratejilerinizi nasıl test ediyorsunuz?',
          options: [
            'TradingView geri testler',
            'Kod yazarak kendim',
            'Hazır platformlar (örnek: Trality, 3Commas)',
            'Test etmiyorum',
          ],
        },
      ],
      condition: (value) => value === 'Evet' || value === 'Kısmen',
    },
    {
      key: 'q5',
      type: 'radio',
      text: '5. Daha önce otomatik alım satım robotu kullandınız mı?',
      options: ['Evet', 'Hayır'],
      subQuestions: [
        {
          key: 'q5_1',
          type: 'checkbox',
          text: '5.1. Hangi platform aracılığı ile robot çalıştırdınız? ',
          options: [
            '3Commas',
            'WunderTrading',
            'Matrix',
            'Diğer',
          ],
        },

      ],
      condition: (value) => value === 'Evet',
    },
    {
      key: 'q6',
      type: 'radio',
      text: '6. Bot kiralama, strateji satın alma veya satabilme imkanınızın olduğu bir website olsa ilgilenir misiniz?',
      options: [
        'Evet, ilgilenirim',
        'Düşünürüm, ama güvenemem',
        'İlgilenmem',
      ],
    },
    {
      key: 'q7',
      type: 'radio',
      text: '7. Kendi stratejinizi başkalarıyla paylaşır mısınız?',
      options: [
        'Ücretli',
        'Ücretsiz',
        'Kâr payı ile',
        'Paylaşmam',
      ],
    },
    {
      key: 'q8',
      type: 'radio',
      text: '8. Başkalarının stratejilerini kullanmayı düşünür müsünüz?',
      options: [
        'Evet. düşünürüm',
        'Geçmiş performansını test ettikten sonra düşünürüm',
        'Hayır, düşünmem',
      ],
    },
    {
      key: 'q9',
      type: 'radio',
      text: '9. Bir stratejinin güvenilirliğini değerlendirmek isteseniz en çok neye dikkat edersiniz?',
      options: [
        'Kazanma oranı',
        'Risk-getiri oranı (Sharpe vs.)',
        'Kullanıcı yorumları',
      ],
    },
    {
      key: 'q10',
      type: 'radio',
      text: '10. Platformun erken sürümünü test etmek ister misiniz?',
      options: ['Evet', 'Hayır'],
      subQuestions: [
        {
          key: 'q10_1',
          type: 'input',
          text: 'E-Mail:',
        },
        {
          key: 'q10_2',
          type: 'input',
          text: 'Telefon:',
        },
      ],      
      condition: (value) => value === 'Evet',
    },
    {
      key: 'q11',
      type: 'textarea',
      text: '11. Platformdan beklentiniz nedir? Hangi özellik sizi en çok heyecanlandırır? Önerileriniz varsa yazınız.',
    },
    {
      key: 'q12',
      type: 'radio',
      text: '12. Aşağıdaki konularda en çok endişeniz olanlar hangileri? (En fazla 3 seçim yapabilirsiniz)',
      options: [
        'Stratejilerimin izinsiz kopyalanması',
        'Botların doğru çalışmaması / zarara uğratması',
        'Platforma bağladığım cüzdanımın güvenliği',
        'Kimlik bilgilerimin 3. kişilerle paylaşılması',
        'Paramın çekilememesi / kaybolması',
        'Dolandırıcılık ihtimali (sahte strateji, sahte kullanıcı vb.)',
        'Destek ekibine ulaşamama / sorun çözülmemesi',
      ],
      maxSelections: 3,
    },
  ];

  const current = questions[currentQuestionIndex];
  const showSubQuestions = current.condition?.(answers[current.key]);

  return (
    <main className="min-h-screen w-full hard-gradient text-black flex justify-center items-center">
      <div className="w-full max-w-3xl min-h-[90vh] flex flex-col justify-between bg-[hsla(0,0%,99%,0.8)] rounded-4xl shadow-xl p-8">
        <div className="overflow-y-auto">
          <h1 className="text-3xl mb-16 text-center">Anket Formu</h1>
  
          {/* Ana Soru */}
          <div className="mb-16">
            <p className="text-base font-semibold mb-6">{current.text}</p>

            {/* Select */}
            {current.type === 'select' && (
              <select
                name={current.key}
                className="w-full p-2 bg-white text-black rounded"
                value={answers[current.key] || ''}
                onChange={(e) => handleChange(current.key, e.target.value)}
              >
                <option value="" disabled>
                  Yaş aralığınızı seçin
                </option>
                {current.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {current.type === 'input' && (
              <input
                type="text"
                name={current.key}
                className="w-full p-2 bg-white text-black rounded"
                placeholder="Yanıtınızı buraya yazabilirsiniz..."
                value={answers[current.key] || ''}
                onChange={(e) => handleChange(current.key, e.target.value)}
              />
            )}


            {/* Range (maaş) */}
            {current.type === 'range' && (
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="number"
                  placeholder="Alt sınır"
                  className="w-full sm:w-1/2 p-2 bg-white text-black rounded"
                  value={answers[current.key]?.min || ''}
                  onChange={(e) =>
                    handleChange(current.key, {
                      ...(answers[current.key] || {}),
                      min: e.target.value,
                    })
                  }
                />
                <input
                  type="number"
                  placeholder="Üst sınır"
                  className="w-full sm:w-1/2 p-2 bg-white text-black rounded"
                  value={answers[current.key]?.max || ''}
                  onChange={(e) =>
                    handleChange(current.key, {
                      ...(answers[current.key] || {}),
                      max: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {/* Radio */}
            {current.type === 'radio' &&
              current.options.map((opt) => (
                <div key={opt} className="flex items-center gap-4 mb-3">
                  <input
                    type="radio"
                    name={current.key}
                    className="w-4 h-4"
                    checked={answers[current.key] === opt}
                    onChange={() => handleChange(current.key, opt)}
                  />
                  <span>{opt}</span>
                </div>
              ))}

            {/* Textarea */}
            {current.type === 'textarea' && (
              <textarea
                name={current.key}
                rows={6}
                className="w-full p-2 bg-white text-black rounded"
                placeholder="Yanıtınızı buraya yazabilirsiniz..."
                value={answers[current.key] || ''}
                onChange={(e) => handleChange(current.key, e.target.value)}
              />
            )}
          </div>

  
          {/* Şartlı alt sorular (aynı kartta) */}
          {showSubQuestions &&
        current.subQuestions?.map((sub) => (
          <div key={sub.key} className="mb-16">
            <p className="text-base font-semibold mb-6">{sub.text}</p>
        
            {/* Checkbox tipi */}
            {sub.type === 'checkbox' &&
              sub.options.map((opt) => (
                <div key={opt} className="flex items-center gap-4 mb-3">
                  <input
                    type="checkbox"
                    name={sub.key}
                    className="w-4 h-4"
                    checked={answers[sub.key]?.includes(opt) || false}
                    onChange={(e) => {
                      const currentAnswers = answers[sub.key] || [];
                      if (e.target.checked) {
                        handleChange(sub.key, [...currentAnswers, opt]);
                      } else {
                        handleChange(
                          sub.key,
                          currentAnswers.filter((item) => item !== opt)
                        );
                      }
                    }}
                  />
                  <span>{opt}</span>
                </div>
              ))}

            {/* Radio tipi */}
            {sub.type === 'radio' &&
              sub.options.map((opt) => (
                <div key={opt} className="flex items-center gap-4 mb-3">
                  <input
                    type="radio"
                    name={sub.key}
                    className="w-4 h-4"
                    checked={answers[sub.key] === opt}
                    onChange={() => handleChange(sub.key, opt)}
                  />
                  <span>{opt}</span>
                </div>
              ))}

      {/* Input tipi (e-mail, telefon vb.) */}
      {sub.type === 'input' && (
        <input
          type={
            sub.text.toLowerCase().includes('mail') ? 'email'
            : sub.text.toLowerCase().includes('telefon') ? 'tel'
            : 'text'
          }
          placeholder={sub.text}
          className="w-full p-2 bg-white text-black rounded"
          value={answers[sub.key] || ''}
          onChange={(e) => handleChange(sub.key, e.target.value)}
        />
      )}
    </div>
  ))}


        </div>
  
        {/* Geri/İleri Butonları */}
        <div className="flex justify-between mt-auto pt-4 border-t border-gray-700">
          <button
            onClick={prevQuestion}
            className="bg-gray-700 px-4 py-2 text-white hover:bg-gray-600 disabled:opacity-30"
            disabled={currentQuestionIndex === 0}
          >
            ◀ Geri
          </button>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={() => {
                console.log('Form tamamlandı:', answers);
                alert('Teşekkürler! Cevaplarınız kaydedildi.');
                // istersen backend'e gönderim veya yönlendirme ekleyebilirsin
              }}
              className="bg-green-600 px-4 py-2 text-white hover:bg-green-500"
            >
               Formu Tamamla
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-30"
            >
              İleri ▶
            </button>
          )}
        </div>

      </div>
    </main>
  );
}