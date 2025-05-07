'use client';

import { useSurveyStore } from '@/store/surveyStore';
import { useThemeStore } from '@/store/themeStore';
import { useEffect, useState } from 'react';

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxTL1jzwwgtPkoEgE2ULwthGrDw0T03sBea8ZzmpN6Ut1WsOzfd-VkYYbxQ1FPnm1Dy/exec"; // kendi URL'inle değiştir

export default function SurveyPage() {
  const { currentQuestionIndex, answers, setAnswer, nextQuestion, prevQuestion } = useSurveyStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [error, setError] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleChange = (key, value) => {
    setAnswer(key, value);
    setError('');
  };

  const validateCurrentQuestion = () => {
    const current = questions[currentQuestionIndex];
    
    // Skip validation for optional questions (11, 12, 13)
    if (['q11', 'q12', 'q13'].includes(current.key)) {
      return true;
    }
    
    if (!answers[current.key]) {
      setError('Lütfen bu soruyu yanıtlayınız.');
      return false;
    }

    // For checkbox questions with maxSelections
    if (current.type === 'checkbox' && current.maxSelections) {
      const selectedCount = answers[current.key]?.length || 0;
      if (selectedCount > current.maxSelections) {
        setError(`En fazla ${current.maxSelections} seçim yapabilirsiniz.`);
        return false;
      }
    }

    // For questions with sub-questions
    if (current.subQuestions && current.condition?.(answers[current.key])) {
      for (const sub of current.subQuestions) {
        if (!answers[sub.key]) {
          setError('Lütfen tüm alt soruları yanıtlayınız.');
          return false;
        }

        // Email validation for q10_1
        if (sub.key === 'q10_1') {
          const email = answers[sub.key];
          if (!email.includes('@')) {
            setError('Lütfen geçerli bir e-posta adresi giriniz.');
            return false;
          }
        }

        // Phone number validation for q10_2
        if (sub.key === 'q10_2') {
          const phone = answers[sub.key];
          if (!/^\d+$/.test(phone)) {
            setError('Lütfen sadece rakamlardan oluşan bir telefon numarası giriniz.');
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentQuestion()) {
      nextQuestion();
    }
  };

  // Toast gösterme fonksiyonu
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
  };

  const questions = [
    {
      key: 'q1',
      type: 'select',
      text: '1. Yaş aralığınızı seçiniz:',
      options: ['-18','18 - 24', '25 - 34', '35 - 44', '45+'],
    },
    {
      key: 'q2',
      type: 'input',
      text: '2. Yatırım için ayırdığınız aylık bütçeniz nedir? (TL cinsinden)',
    },
    {
      key: 'q3',
      type: 'radio',
      text: '3. Finansal piyasalara (kripto, hisse, forex vb.) ilginiz var mı?',
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
            'TradingView aracılığıyla',
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
            'Matrix',
            'Kendim',
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
        'Evet, düşünürüm',
        'Geçmiş performansını yeterince test ettikten sonra düşünebilirim',
        'Hayır, düşünmem',
      ],
    },
    {
      key: 'q9',
      type: 'radio',
      text: '9. Bir stratejinin güvenilirliğini değerlendirmek isteseniz en çok neye dikkat edersiniz?',
      options: [
        'Kazandığı işlemlerin oranı',
        'Risk ve kazanç dengesi',
        'En fazla zarar ettiği miktar ve dönem',
        'Toplam kazanç',
        'Diğer kullanıcıların yorumları',
        'Farklı piyasa koşullarında gösterdiği performans',
        'Stratejinin nasıl çalıştığına dair şeffaflığı',
      ],
    },
    {
      key: 'q10',
      type: 'radio',
      text: '10. Platformumuzun erken sürüm testlerinde yer almak ister misiniz?',
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
      text: '11. Platformumuzdan beklentileriniz nelerdir?',
    },
    {
      key: 'q12',
      type: 'textarea',
      text: '12. Hangi özellik sizi en çok heyecanlandırır?',
    },
    {
      key: 'q13',
      type: 'textarea',
      text: '13. Önerileriniz varsa yazınız.',
    },
    {
      key: 'q14',
      type: 'checkbox',
      text: '14. Aşağıdakilerden en çok endişeniz olanlar hangileri?',
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
    <main className={`min-h-screen w-full transition-colors duration-300 ${
      isDarkMode ? 'hard-gradient' : 'light-gradient'
    } flex justify-center items-center p-4`}>
      {/* Toast Notifications */}
      {(isSubmitting || toast.show) && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`flex items-center space-x-3 px-6 py-3 rounded-xl shadow-lg backdrop-blur-lg transition-all duration-300 ${
            isSubmitting 
              ? isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
              : toast.type === 'success'
                ? isDarkMode ? 'bg-green-800/90' : 'bg-green-100/90'
                : isDarkMode ? 'bg-red-800/90' : 'bg-red-100/90'
          }`}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Cevaplarınız kaydediliyor...
                </span>
              </>
            ) : (
              <>
                {toast.type === 'success' ? (
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className={`text-sm font-medium ${
                  isDarkMode 
                    ? toast.type === 'success' ? 'text-green-200' : 'text-red-200'
                    : toast.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {toast.message}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      <div className={`w-full max-w-3xl h-[90vh] flex flex-col backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 relative ${
        isDarkMode ? 'bg-black/90' : 'bg-white/90'
      }`}>
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 backdrop-blur-sm ${
            isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'
          }`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <svg className="w-6 h-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
          Whaleer Kullanıcı Anketi
        </h1>

        {!isStarted ? (
          // Introduction Page
          <div className="flex-1 flex flex-col items-center overflow-y-auto">
            <div className="w-full max-w-2xl px-4 py-6 space-y-6">
              <p className={`text-lg md:text-xl leading-relaxed text-justify ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Merhaba! 👋
              </p>
              <p className={`text-lg md:text-xl leading-relaxed text-justify ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Whaleer olarak, algoritmik alım-satım dünyasında sadece strateji geliştirmekle kalmayıp, onu test edebileceğin, başkalarıyla paylaşabileceğin ve otomatik şekilde çalıştırabileceğin bir alan oluşturuyoruz.
              </p>
              <p className={`text-lg md:text-xl leading-relaxed text-justify ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Bu kısa anketi meraklı ve yetenekli kullanıcılarımızı daha iyi anlayabilmek için hazırladık. Yanıtların, platformumuzu daha güvenli, sezgisel ve verimli hale getirmemizde bize ışık tutacak.
              </p>
              <p className={`text-lg md:text-xl leading-relaxed text-justify ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Vakit ayırdığın için şimdiden teşekkür ederiz. Hazırsan başlayalım! ✨
              </p>
            </div>
            <div className="w-full max-w-2xl px-4 py-4">
              <button
                onClick={() => setIsStarted(true)}
                className="w-full px-6 md:px-8 py-3 md:py-4 bg-blue-600 text-white text-lg md:text-xl rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Ankete Başla
              </button>
            </div>
          </div>
        ) : isCompleted ? (
          // Thank You Page
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 px-4">
            <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-4">
              <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                Teşekkürler!
              </h2>
              <p className={`text-lg md:text-xl leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Whaleer olarak yakında karşınızda olacağız. Görüşleriniz bizim için çok değerli.
              </p>
              <p className={`text-base md:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                ✨ Platformumuz hazır olduğunda sizi haberdar edeceğiz. ✨
              </p>
            </div>
          </div>
        ) : (
          // Questions Section
          <>
            <div className="flex-1 overflow-y-auto pr-2">
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Ana Soru */}
              <div className="mb-8 space-y-6">
                <p className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{current.text}</p>

                {/* Select */}
                {current.type === 'select' && (
                  <select
                    name={current.key}
                    className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-800 text-gray-100 border-gray-700' 
                        : 'bg-white text-gray-900 border-gray-200'
                    }`}
                    value={answers[current.key] || ''}
                    onChange={(e) => handleChange(current.key, e.target.value)}
                  >
                    <option value="" disabled>Yaş aralığınızı seçin</option>
                    {current.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}

                {/* Input */}
                {current.type === 'input' && (
                  <input
                    type={current.key === 'q2' ? 'number' : 'text'}
                    name={current.key}
                    min={current.key === 'q2' ? '0' : undefined}
                    step={current.key === 'q2' ? '1' : undefined}
                    className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-800 text-gray-100 border-gray-700' 
                        : 'bg-white text-gray-900 border-gray-200'
                    }`}
                    placeholder={current.key === 'q2' ? "Sadece sayı giriniz..." : "Yanıtınızı buraya yazabilirsiniz..."}
                    value={answers[current.key] || ''}
                    onChange={(e) => {
                      if (current.key === 'q2') {
                        const value = e.target.value;
                        if (value === '' || /^\d+$/.test(value)) {
                          handleChange(current.key, value);
                        }
                      } else {
                        handleChange(current.key, e.target.value);
                      }
                    }}
                  />
                )}

                {/* Radio */}
                {current.type === 'radio' && (
                  <div className="space-y-3">
                    {current.options.map((opt) => (
                      <label key={opt} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700' 
                          : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                      }`}>
                        <input
                          type="radio"
                          name={current.key}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                          checked={answers[current.key] === opt}
                          onChange={() => handleChange(current.key, opt)}
                        />
                        <span className="ml-3">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Checkbox */}
                {current.type === 'checkbox' && (
                  <div className="space-y-3">
                    {current.options.map((opt) => (
                      <label key={opt} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700' 
                          : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                      }`}>
                        <input
                          type="checkbox"
                          name={current.key}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                          checked={answers[current.key]?.includes(opt) || false}
                          onChange={(e) => {
                            const currentAnswers = answers[current.key] || [];
                            if (e.target.checked) {
                              if (current.maxSelections && currentAnswers.length >= current.maxSelections) {
                                setError(`En fazla ${current.maxSelections} seçim yapabilirsiniz.`);
                                return;
                              }
                              handleChange(current.key, [...currentAnswers, opt]);
                            } else {
                              handleChange(
                                current.key,
                                currentAnswers.filter((item) => item !== opt)
                              );
                            }
                          }}
                        />
                        <span className="ml-3">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Textarea */}
                {current.type === 'textarea' && (
                  <textarea
                    name={current.key}
                    rows={6}
                    className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-800 text-gray-100 border-gray-700' 
                        : 'bg-white text-gray-900 border-gray-200'
                    }`}
                    placeholder="Yanıtınızı buraya yazabilirsiniz..."
                    value={answers[current.key] || ''}
                    onChange={(e) => handleChange(current.key, e.target.value)}
                  />
                )}
              </div>

              {/* Alt Sorular */}
              {showSubQuestions && current.subQuestions?.map((sub) => (
                <div key={sub.key} className="mb-8 space-y-6">
                  <p className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{sub.text}</p>
                  
                  {/* Checkbox */}
                  {sub.type === 'checkbox' && (
                    <div className="space-y-3">
                      {sub.options.map((opt) => (
                        <label key={opt} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700' 
                            : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                        }`}>
                          <input
                            type="checkbox"
                            name={sub.key}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                            checked={answers[sub.key]?.includes(opt) || false}
                            onChange={(e) => {
                              const currentAnswers = answers[sub.key] || [];
                              if (e.target.checked) {
                                if (sub.maxSelections && currentAnswers.length >= sub.maxSelections) {
                                  setError(`En fazla ${sub.maxSelections} seçim yapabilirsiniz.`);
                                  return;
                                }
                                handleChange(sub.key, [...currentAnswers, opt]);
                              } else {
                                handleChange(
                                  sub.key,
                                  currentAnswers.filter((item) => item !== opt)
                                );
                              }
                            }}
                          />
                          <span className="ml-3">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Radio */}
                  {sub.type === 'radio' && (
                    <div className="space-y-3">
                      {sub.options.map((opt) => (
                        <label key={opt} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700' 
                            : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                        }`}>
                          <input
                            type="radio"
                            name={sub.key}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                            checked={answers[sub.key] === opt}
                            onChange={() => handleChange(sub.key, opt)}
                          />
                          <span className="ml-3">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Input (email, phone) */}
                  {sub.type === 'input' && (
                    <input
                      type={
                        sub.text.toLowerCase().includes('mail') ? 'email'
                        : sub.text.toLowerCase().includes('telefon') ? 'tel'
                        : 'text'
                      }
                      placeholder={sub.text}
                      className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-800 text-gray-100 border-gray-700' 
                          : 'bg-white text-gray-900 border-gray-200'
                      }`}
                      value={answers[sub.key] || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (sub.key === 'q10_2') {
                          if (value === '' || /^\d+$/.test(value)) {
                            handleChange(sub.key, value);
                          }
                        } else {
                          handleChange(sub.key, value);
                        }
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
      
            {/* Navigation Buttons */}
            <div className={`flex justify-between mt-6 pt-6 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <button
                onClick={prevQuestion}
                className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50`}
                disabled={currentQuestionIndex === 0}
              >
                ◀ Geri
              </button>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={async () => {
                    if (validateCurrentQuestion()) {
                      setIsSubmitting(true);
                      try {
                        const res = await fetch('/api/save', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(answers),
                        });
                      
                        if (res.ok) {
                          showToast('success', 'Teşekkürler! Cevaplarınız başarıyla kaydedildi.');
                          setIsCompleted(true);
                        } else {
                          showToast('error', 'Kaydetme başarısız oldu. Lütfen tekrar deneyin.');
                        }
                      } catch (err) {
                        console.error('Gönderim hatası:', err);
                        showToast('error', 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.');
                      } finally {
                        setIsSubmitting(false);
                      }
                    }
                  }}
                  disabled={isSubmitting}
                  className={`px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Formu Tamamla'}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300"
                >
                  İleri ▶
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}