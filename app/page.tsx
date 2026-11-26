"use client";

import { useState, useEffect } from "react";

// --- БАЗА ВСЕХ ДОПОЛНИТЕЛЬНЫХ ОПЦИЙ ---
// (Они нужны, чтобы калькулятор знал названия и цены)
const allExtras = [
  { id: "guard", name: "Защитное ограждение печи", price: 5000 },
  { id: "sliv", name: "Дополнительный слив-желоб", price: 6000 },
  { id: "portal", name: "Замена оцинкованных экранов на отделку печного портала минеритом", price: 25000 },
  { id: "ermak16", name: "Замена печи «Ермак-12» на «Ермак-16»", price: 10000 },
  { id: "linden", name: "Полки из липы вместо осины", price: 10000 },
  { id: "g_upper", name: "Г-образная верхняя полка", price: 6000 },
  { id: "g_lower", name: "Г-образная нижняя полка", price: 6000 },
  { id: "steam_shelf", name: "Парящий полок", price: 8500 },
  { id: "backrest", name: "Спинка над полком в парной", price: 2000 },
  { id: "led", name: "Диодная подсветка под полками", price: 10000 },
  { id: "vent", name: "Система вентиляции «Второе дыхание»", price: 22000 },
  { id: "bench_wash", name: "Деревянная скамья в моечной", price: 3000 },
  { id: "tropic_shower", name: "Тропический душ", price: 15000 },
  { id: "tropic_shower_boiler", name: "Тропический душ вместе с бойлером", price: 35000 },
  { id: "bucket", name: "Обливное ведро с подводом холодной воды", price: 12000 },
  { id: "pipes", name: "Подвод труб для душа и бойлера без сантехники", price: 10000 },
  { id: "pipes_wc", name: "Подвод труб и слива под унитаз", price: 12000 },
  { id: "wc_sep", name: "Отделение для санузла", price: 12000 },
  { id: "set1", name: "Унитаз + душ + бойлер", price: 55000 },
  { id: "set2", name: "Унитаз + душ + раковина", price: 58000 },
  { id: "set3", name: "Унитаз + бойлер + раковина", price: 70000 },
  { id: "set4", name: "Унитаз + бойлер + раковина + душ", price: 85000 },
  { id: "bench_pine", name: "Дополнительная скамья из сосны", price: 3000 },
  { id: "dry_contour", name: "«Сухой контур» — защитная пропитка всех деревянных поверхностей", price: 20000 },
  { id: "warm_walls", name: "Увеличение утепления стен со 100 до 150 мм", price: 18000 },
  { id: "warm_floor", name: "Увеличение утепления пола со 100 до 150 мм", price: 7000 },
  { id: "floor_protect", name: "Обработка пола защитными составами", price: 10000 },
  { id: "out_led", name: "Уличное точечное освещение", price: 11000 },
  { id: "facade_led", name: "Фасадное освещение", price: 15000 },
  { id: "facade_rail", name: "Фасадные рейки", price: 12000 },
  { id: "mesh", name: "Сетка от грызунов", price: 6000 },
  { id: "lam_windows", name: "Ламинация окон", price: 13000 },
  { id: "step", name: "Деревянная входная ступень", price: 6000 },
  { id: "roof_color", name: "Цветной профлист С-20 вместо оцинкованного", price: 10000 },
  { id: "terrace_open", name: "Открытая терраса 2,3 х 8 м", price: 110000 },
  { id: "terrace_open1", name: "Открытая терраса 2,3 х 7 м", price: 110000 },
  { id: "terrace_grape1", name: "Открытая терраса с одним «виноградником»", price: 150000 },
  { id: "terrace_grape2", name: "Открытая терраса с двумя «виноградниками»", price: 190000 },
  { id: "terrace_closed", name: "Закрытая терраса с крышей", price: 250000 },
];

// Категории для красивого отображения
const categories = [
  { title: "1. Парная и печное оборудование", ids: ["guard","sliv", "portal", "ermak16", "linden", "g_upper", "g_lower", "steam_shelf", "backrest", "led", "vent"] },
  { title: "2. Моечная и водоснабжение", ids: ["bench_wash", "tropic_shower", "tropic_shower_boiler", "bucket", "pipes", "pipes_wc"] },
  { title: "3. Санузел и сантехника", ids: ["wc_sep", "set1", "set2", "set3", "set4"] },
  { title: "4. Комната отдыха", ids: ["bench_pine", "dry_contour"] },
  { title: "5. Утепление и обработка пола", ids: ["warm_walls", "warm_floor", "floor_protect"] },
  { title: "6. Внешнее оформление и элементы", ids: ["out_led", "facade_led", "facade_rail", "mesh", "lam_windows", "step"] },
  { title: "7. Кровля", ids: ["roof_color"] },
  { title: "8. Террасы", ids: ["terrace_open","terrace_open1", "terrace_grape1", "terrace_grape2", "terrace_closed"] },
];

const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
};

// --- МОДАЛЬНОЕ ОКНО ---
function BathModal({ bath, onClose }: { bath: any; onClose: () => void }) {
  const [selectedExtras, setSelectedExtras] = useState<Record<string, boolean>>({});
  const [activeImage, setActiveImage] = useState(bath.images[0]);
  
  // Состояния для окна с контактами
  const [showContactForm, setShowContactForm] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) => {
      const newState = { ...prev, [id]: !prev[id] };
      const isSelected = newState[id];

      if (isSelected) {
        if (["set1", "set2", "set3", "set4"].includes(id)) {
          ["set1", "set2", "set3", "set4"].forEach(k => {
            if (k !== id) newState[k] = false;
          });
        }
        if (id === "g_upper") newState["g_lower"] = false;
        if (id === "g_lower") newState["g_upper"] = false;
        if (id === "steam_shelf") { newState["g_upper"] = false; newState["g_lower"] = false; }
        if (id === "g_upper" || id === "g_lower") newState["steam_shelf"] = false;
        if (id === "tropic_shower") newState["tropic_shower_boiler"] = false;
        if (id === "tropic_shower_boiler") newState["tropic_shower"] = false;
      }
      return newState;
    });
  };

  const isDisabled = (id: string) => {
    if (bath.includedExtras && bath.includedExtras.includes(id)) return true;
    if (["set1", "set2", "set3", "set4"].includes(id)) {
      if (["set1", "set2", "set3", "set4"].some(k => k !== id && selectedExtras[k])) return true;
    }
    if (id === "g_upper" && selectedExtras["g_lower"]) return true;
    if (id === "g_lower" && selectedExtras["g_upper"]) return true;
    if (id === "steam_shelf" && (selectedExtras["g_upper"] || selectedExtras["g_lower"])) return true;
    if ((id === "g_upper" || id === "g_lower") && selectedExtras["steam_shelf"]) return true;
    if (id === "tropic_shower" && selectedExtras["tropic_shower_boiler"]) return true;
    if (id === "tropic_shower_boiler" && selectedExtras["tropic_shower"]) return true;
    return false;
  };

  const calculateTotal = () => {
    let total = bath.basePrice;
    allExtras.forEach((extra) => {
      if (selectedExtras[extra.id]) total += extra.price;
    });
    return total;
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        
        <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-gray-100 text-gray-900 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-md border border-gray-200">✕</button>

        <div className="flex flex-col md:flex-row h-full w-full overflow-hidden">
          
          {/* ЛЕВАЯ КОЛОНКА (Фото) */}
          <div className="md:w-1/2 bg-gray-50 p-6 flex flex-col gap-4 overflow-y-auto border-r border-gray-200">
            <div className="h-64 md:h-80 w-full rounded-xl overflow-hidden bg-white shadow-sm shrink-0">
              <img src={activeImage} alt={bath.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 shrink-0">
              {bath.images.map((img: string, i: number) => (
                <img key={i} src={img} onClick={() => setActiveImage(img)} className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${activeImage === img ? 'border-amber-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`} />
              ))}
            </div>
            <div className="mt-auto bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center shrink-0 mb-6 md:mb-0">
              <h4 className="font-bold text-gray-800 mb-2">Планировка ({bath.size})</h4>
              {bath.plan ? (
                <img 
                  src={bath.plan} 
                  alt={`Планировка ${bath.name}`} 
                  className="w-full h-auto max-h-48 object-contain rounded-lg bg-gray-50 cursor-pointer"
                  onClick={() => setActiveImage(bath.plan)} 
                />
              ) : (
                <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
                   <span className="text-gray-400 text-sm">Чертеж / План</span>
                </div>
              )}
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА (Опции) */}
          <div className="md:w-1/2 flex flex-col h-full bg-white relative">
            <div className="flex-grow overflow-y-auto p-6 md:p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 pr-10">{bath.name}</h2>
              
              {bath.shortDescription && (
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg mb-6">
                  <p className="text-amber-900 text-sm leading-relaxed">{bath.shortDescription}</p>
                </div>
              )}

              <div className="mb-6">
                <p className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-2">Базовая комплектация:</p>
                <ul className="grid grid-cols-2 gap-2 text-sm">
                  {bath.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="text-amber-500 mr-2">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
                            {/* Блок с подробным описанием (выпадающий) */}
              {bath.details && (
                <details className="mb-6 bg-gray-50 rounded-lg border border-gray-200 group">
                  <summary className="font-bold text-gray-800 cursor-pointer p-3 flex justify-between items-center hover:bg-gray-100 transition-colors">
                    📋 Подробное описание конструкции
                    <span className="text-amber-600 text-xl group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 border-t border-gray-200 text-sm text-gray-700 space-y-3">
                    <p><strong className="text-gray-900">Общее:</strong> {bath.details.summary}</p>
                    <p><strong className="text-gray-900">Конструкция:</strong> {bath.details.construction}</p>
                    <p><strong className="text-gray-900">Парная:</strong> {bath.details.steamRoom}</p>
                    <p><strong className="text-gray-900">Комната отдыха:</strong> {bath.details.restRoom}</p>
                    <p><strong className="text-gray-900">Окна и двери:</strong> {bath.details.windows}</p>
                    <p><strong className="text-gray-900">Электрика:</strong> {bath.details.electric}</p>
                  </div>
                </details>
              )}

              <div className="border-t border-gray-100 pt-4">
                <p className="font-bold text-lg mb-4 text-gray-800">Дополнительные опции:</p>
                
                <div className="space-y-6">
                  {categories.map((cat, idx) => {
                    const availableItems = cat.ids
                      .map(id => allExtras.find(e => e.id === id))
                      .filter(item => item && bath.availableExtras.includes(item.id));

                    if (availableItems.length === 0) return null;

                    return (
                      <div key={idx}>
                        <h4 className="font-bold text-amber-600 mb-3 bg-amber-50 p-2 rounded">{cat.title}</h4>
                        <div className="space-y-1 pl-1">
                          {availableItems.map((extra) => {
                            if (!extra) return null;
                            const disabled = isDisabled(extra.id);
                            const isIncluded = bath.includedExtras?.includes(extra.id);

                            return (
                              <label key={extra.id} className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${isIncluded ? 'bg-green-50 border border-green-100' : disabled ? 'opacity-40 cursor-not-allowed bg-gray-50' : 'cursor-pointer group hover:bg-gray-50'}`}>
                                {isIncluded ? (
                                  <span className="text-green-600 font-bold text-lg mt-0.5 shrink-0">✓</span>
                                ) : (
                                  <input type="checkbox" className={`mt-1 w-5 h-5 text-amber-600 rounded border-gray-300 focus:ring-amber-500 shrink-0 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`} checked={!!selectedExtras[extra.id]} onChange={() => toggleExtra(extra.id)} disabled={disabled} />
                                )}
                                
                                <div className="flex justify-between w-full text-sm items-start gap-2">
                                  <span className={`leading-tight ${isIncluded ? 'text-green-800 font-medium' : 'text-gray-700 group-hover:text-black transition-colors'}`}>
                                    {extra.name} {isIncluded && <span className="text-xs text-green-600 block">Уже в базовой комплектации</span>}
                                  </span>
                                  <span className={`font-semibold whitespace-nowrap ${isIncluded ? 'text-green-600' : 'text-gray-500'}`}>
                                    {isIncluded ? 'Включено' : `+${formatPrice(extra.price)}`}
                                  </span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Блок с итоговой суммой и кнопками */}
            <div className="bg-gray-50 border-t border-gray-200 p-6 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-end mb-4">
                <span className="text-gray-600 font-medium">Итого:</span>
                <span className="text-3xl font-bold text-amber-600">{formatPrice(calculateTotal())}</span>
              </div>
              
              <div className="flex gap-2">
                <a href="tel:+79116115741" className="w-1/2 bg-white border-2 border-gray-900 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors block text-center">
                  Позвонить
                </a>
                <button onClick={() => setShowContactForm(true)} className="w-1/2 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center">
                  Отправить заявку
                </button>
              </div>
            </div>

            {/* НОВОЕ ОКНО ДЛЯ ВВОДА КОНТАКТОВ */}
            {showContactForm && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl">
                <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm mx-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Куда вам перезвонить?</h3>
                  
                  <div className="space-y-3 mb-6">
                    <input type="text" placeholder="Ваше имя" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    <input type="tel" placeholder="Ваш телефон" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => setShowContactForm(false)} className="w-1/3 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                      Отмена
                    </button>
                    <button onClick={() => {
                        if (!clientName || !clientPhone) {
                          alert("Пожалуйста, заполните имя и телефон.");
                          return;
                        }
                        const selectedNames = allExtras.filter(e => selectedExtras[e.id]).map(e => `- ${e.name} (+${formatPrice(e.price)})`).join('\n');
                        const text = `🔥 Новая заявка с сайта!\n\n👤 Клиент: ${clientName}\n📞 Телефон: ${clientPhone}\n\n🏠 Баня: ${bath.name} (${bath.size})\n💰 Итого: ${formatPrice(calculateTotal())}\n\n✅ Опции:\n${selectedNames || "Только базовые опции"}`;
                        
                        // ВАШИ ДАННЫЕ ВК
                        const VK_TOKEN = "vk1.a.w0yYJzcsWNlxiVvbqW82Uij6YJoXRA0gfgSHGz8-QkOS7jeDFPf2rWYwdNPz08V4xnaBK5X3uxcR2iD8QapffuE_GClhxEWr70WFkMChK0dFS74x0fSFQn4IhIvkkc4NRaTHvl2KQIcLKZjaFXxgHSVe4Hd7d2N5XaFlNqOme_iWyWZ15zoUZk-I8frawCUYY3sr7ovoW-c-teb8Uv7okw"; 
                        const VK_PEER_ID = "70304896"; 
                        const VK_GROUP_ID = "210565647"; 

                        const url = `https://api.vk.com/method/messages.send?access_token=${VK_TOKEN}&v=5.131&peer_id=${VK_PEER_ID}&message=${encodeURIComponent(text)}&random_id=${Math.floor(Math.random() * 1000000)}`;
                        
                        fetch(url).then(res => res.json()).then(data => {
                          if (data.response) {
                            alert("Спасибо! Заявка отправлена.");
                            setShowContactForm(false);
                            setClientName("");
                            setClientPhone("");
                          } else {
                            alert("Ошибка при отправке. Пожалуйста, позвоните нам.");
                          }
                        }).catch(() => alert("Ошибка сети. Пожалуйста, позвоните нам."));
                      }} 
                      className="w-2/3 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                    >
                      Отправить
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// --- ГЛАВНЫЙ КОМПОНЕНТ ---
export default function Home() {
  const [year, setYear] = useState(2025);
  const [selectedBath, setSelectedBath] = useState<any>(null);

  useEffect(() => { setYear(new Date().getFullYear()); }, []);

  const baths = [
    {
      id: 1, name: "Баня под ключ", size: "2,4 х 8,0 м",
      shortDescription: "Отличный старт для дачного участка. В базовую стоимость уже входит парная, душевая, санузел и компактная комната отдыха. Идеально для семьи из 3-4 человек.",
      features: ["Парная на 4 человека", "Комната отдыха", "Душевая", "Санузел"],
      basePrice: 631000, images: ["/bath11/skan8.jpg", "/bath11/skan81.jpg", "/bath11/skan82.jpg", "/bath11/skan83.jpg", "/bath11/skan84.jpg", "/bath11/skan85.jpg", "/bath11/skan86.jpg", "/bath11/skan87.jpg", "/bath11/skan88.jpg"],
      plan: "/bath11/skan89.jpg",
       details: {
        construction: "Основание — брус 100х150, лаги 40х100 (шаг 0,5 м), антисептик. Стены — каркас 100х40, утепление Rockwool 100 мм, ветро- и пароизоляция. Отделка снаружи и внутри — имитация бруса. Кровля — односкатная, профлист С-20 (графит).",
        steamRoom: "Двухъярусный полок из осины. Печь «Ермак-12» с баком 60 л на трубе, защитное ограждение. 2 светильника с абажурами + диодная подсветка под полком. Слив по технологии «Желоб» с сифоном через пол.",
        washRoom: "Слив «Желоб».",
        restRoom: "Мебель в комплекте — лавка и стол. Двойная розетка, выключатель, автомат 16 А, кабель для подключения.",
        windows: "Деревянные окна 40х40 см — 2 шт. (графит). ПВХ окно 1,5х1,7 м (открывающееся). Входная дверь ПВХ 1,90х0,75 м. Стеклянные матовые двери (бронза) — 3 шт. (парная, моечная, санузел).",
        electric: "Плафоны в каждом помещении. Уличная фасадная подсветка — 6 светильников. Диодная подсветка под полком в парной. Розетка, автомат, выведенный эл. кабель.",
        summary: "Готовая каркасная баня с парной, моечной, комнатой отдыха и полным оснащением. Всё продумано до мелочей: от утепления Rockwool до печи «Ермак» и диодной подсветки."
      },
       includedExtras: ["guard", "led", "bench_pine","wc_sep","facade_led", "lam_windows","sliv", "roof_color"],
      // Список ID опций, которые ДОСТУПНЫ для этой бани:
      availableExtras: [
        "guard", "sliv", "portal", "ermak16", "linden", "g_upper", "g_lower", "steam_shelf", "backrest", "led", "vent", 
        "bench_wash", "tropic_shower", "tropic_shower_boiler", "bucket", "pipes", "pipes_wc", 
        "wc_sep", "set1", "set2", "set3", "set4", 
        "bench_pine", "dry_contour", "warm_walls", "warm_floor", "floor_protect", 
        "out_led", "facade_led", "facade_rail", "mesh", "lam_windows", "step", "roof_color", "terrace_open","terrace_grape1","terrace_grape2", "terrace_closed"
        // Террасы (terrace_...) сюда не включены, так как в базовой уже есть открытая терраса
      ]
    },
    {
      id: 2, name: "Баня в скандинавском стиле", size: "2,4 х 7,0 м",
      shortDescription: "Готовая баня под ключ в скандинавском стиле. Установка за 1 день, предоплата 0%, доставка бесплатно (до 500 км). Продуманная планировка «4 в 1»: парная, моечная, санузел и комната отдыха. В базовую комплектацию уже входит печь «Сахара 16 ЛК» с ограждением, слив «Желоб», заводская мебель (стол и 2 лавки), стеклянные двери из матовой бронзы и уличная подсветка. Цвет — болотно-зеленый с графитовыми элементами.",
      features: ["Парная с печью «Сахара»", "Моечная со сливом", "Санузел", "Комната отдыха с мебелью"],
      basePrice: 603000, images: ["/bath21/1.jpg", "/bath21/2.jpg","/bath21/3.jpg","/bath21/4.jpg","/bath21/5.jpg","/bath21/6.jpg","/bath21/7.jpg","/bath21/8.jpg","/bath21/9.jpg",],
      plan: "/bath21/10.jpg",
            details: {
        summary: "Готовая каркасная баня в скандинавском стиле с продуманной планировкой «4 в 1». Включает парную, моечную, санузел и комфортную комнату отдыха с заводской мебелью.",
        construction: "Основание — брус 100х150 мм, лаги 40х100 мм (шаг 0,5 м), обработаны антисептиком. Стены — каркас 100х40, утепление Rockwool 100 мм, ветро- и пароизоляция. Отделка снаружи и внутри — имитация бруса. Кровля односкатная, профлист С-20, ветровые элементы графит. Основной цвет бани — болотно-зеленый (RAL 2679), обноска и наличники — графит.",
        floors: "Черновой пол 20 мм (антисептик), чистовой — шпунтованная доска 27 мм. Утепление пола и потолка — рулонный Knauf (100 мм), в помывочной — Пеноплекс.",
        steamRoom: "Отделка осиновой вагонкой класса А с алюминиевой фольгой, плинтус. Двухъярусный осиновый полок (парящий). Печь «Сахара 16 ЛК» с баком 60 л на трубе, защитное ограждение.",
        washRoom: "Душевая: отделка вагонкой хвойных пород, слив по технологии «Желоб».",
        restRoom: "Отделка вагонкой хвойных пород, плинтус. Заводская мебель: 2 лавки, стол.",
        windows: "Деревянные окна 40х40 см (3 шт., графит) и ПВХ-окно (60х150 см открывающееся с торца). Входная дверь ПВХ (графит), внутренние стеклянные двери матовая бронза (3 шт.).",
        electric: "Плафоны «Раунд» в каждом помещении; в парной — два светильника с декоративными абажурами. Двойная розетка в комнате отдыха. Автомат 16 А, двойной выключатель, выведен кабель для подключения (выход с задней стороны сверху). Уличная точечная подсветка — 6 светильников.",
      },
       includedExtras: ["guard", "bench_pine","wc_sep","out_led", "lam_windows", "steam_shelf"],
      // Список ID опций, которые ДОСТУПНЫ для этой бани:
      availableExtras: [
        "guard","sliv", "portal", "ermak16", "linden", "g_upper", "g_lower", "steam_shelf", "backrest", "led", "vent", 
        "bench_wash", "tropic_shower", "tropic_shower_boiler", "bucket", "pipes", "pipes_wc", 
        "wc_sep", "set1", "set2", "set3", "set4", 
        "bench_pine", "dry_contour", "warm_walls", "warm_floor", "floor_protect", 
        "out_led", "facade_led", "facade_rail", "mesh", "lam_windows", "step", "roof_color",
         "terrace_grape1", "terrace_open1", "terrace_grape2", "terrace_closed"// Можно добавить открытую террасу
      ]
    },
    {
      id: 3, name: "Модульная баня под ключ с террасой", size: "4,6 х 6,5 м",
            shortDescription: "Модульная баня под ключ в современном скандинавском стиле. Вмещает целых 5 отделений, включая просторную парную с печью «Искандер», тамбур и отдельный санузел. Благородный болотно-зеленый цвет с графитовыми элементами. Доставка и установка без предоплаты!",
      features: ["Большая парная", "Комната отдыха", "Санузел с моечной", "Терраса"],
      basePrice: 1170000, images: ["/bath31/1.jpg", "/bath31/2.jpg","/bath31/3.jpg","/bath31/4.jpg","/bath31/5.jpg","/bath31/6.jpg","/bath31/7.jpg","/bath31/8.jpg",],
            plan: "/bath31/9.jpg",
      details: {
        summary: "Модульная баня премиум-класса в скандинавском стиле с террасой 1,5 м. Идеальна для больших компаний и семейных вечеров. Включает 5 функциональных отделений, продуманных до мелочей.",
        construction: "Модульная конструкция с тамбуром для защиты от холода и пыли. Благородный болотно-зеленый цвет в сочетании с графитовыми углами и наличниками. Входная дверь и окна из профиля ПВХ. Стеклянные двери (бронза матовая) между отделениями.",
        steamRoom: "Двухъярусный осиновый парящий полок класса А. Печь «Искандер 3К 16 Ураган» (выход трубы в крышу), портал из минерита.",
        washRoom: "Слив по технологии «Желоб», обливное ведро и подвод труб под тропический душ.",
        restRoom: "Зона отдыха с заводской мебелью (2 лавки).",
        wc: "Отдельное помещение, готовое под установку вашей сантехники.",
        terrace: "Терраса 1,5 м — идеально для летних вечеров.",
        electric: "Уличная точечная подсветка — красиво и снаружи, и внутри.",
      },
      includedExtras: ["terrace_closed", "bench_pine","wc_sep","out_led", "bucket", "lam_windows", "steam_shelf","step"],
      // Список ID опций, которые ДОСТУПНЫ для этой бани:
      availableExtras: [
        "guard","sliv", "portal", "ermak16", "linden", "g_upper", "g_lower", "steam_shelf", "backrest", "led", "vent", 
        "bench_wash", "tropic_shower", "tropic_shower_boiler", "bucket", "pipes", "pipes_wc", 
        "wc_sep", "set1", "set2", "set3", "set4", 
        "bench_pine", "dry_contour", "warm_walls", "warm_floor", "floor_protect", 
        "out_led", "facade_led", "facade_rail", "mesh", "lam_windows", "step", "roof_color",
         "terrace_grape1", "terrace_open1", "terrace_grape2", "terrace_closed"// Можно добавить открытую террасу
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <header className="bg-gray-900 text-white p-4 shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo21.jpg" alt="Логотип" className="h-10 md:h-12 w-auto object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <h1 className="text-2xl font-bold tracking-wider text-red-600">БАНЯ ПОД КЛЮЧ</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 hidden md:inline">Звоните ежедневно с 9:00 до 21:00</span>
            <a href="tel:+79116115741" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md font-bold text-lg transition-colors flex items-center gap-2">
              📞 +7 (911) 611-57-41
            </a>
          </div>
        </div>
      </header>

      <section className="bg-gray-800 text-white py-12 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Каталог готовых бань</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">Нажмите на карточку, чтобы посмотреть все фото и собрать комплектацию.</p>
      </section>

      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {baths.map((bath) => (
            <div key={bath.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-200 group cursor-pointer" onClick={() => setSelectedBath(bath)}>
              <div className="relative h-60 overflow-hidden">
                <img src={bath.images[0]} alt={bath.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-4 right-4 bg-gray-900/80 text-white font-bold px-3 py-1 rounded-md backdrop-blur-sm">{bath.size}</div>
              </div>
              <div className="p-6 flex flex-col flex-grow items-center text-center">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">{bath.name}</h3>
                <p className="text-amber-600 font-bold text-xl mb-4">от {formatPrice(bath.basePrice)}</p>
                <button className="mt-auto w-full bg-gray-900 text-white py-3 rounded-lg font-semibold group-hover:bg-amber-600 transition-colors">Подробнее</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <section className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Наше производство</h3>
            <p className="text-gray-600 mb-2 flex items-center gap-2"><span className="text-amber-600 text-xl">📍</span> Новгородская область, г. Пестово</p>
            <p className="text-gray-600 flex items-center gap-2"><span className="text-amber-600 text-xl">🕒</span> Режим работы: Ежедневно с 9:00 до 21:00</p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Связаться с нами</h3>
            <p className="text-gray-600 mb-4">Ответим на все вопросы, рассчитаем доставку и монтаж.</p>
            <a href="tel:+79116115741" className="text-3xl font-bold text-amber-600 hover:text-amber-700 transition-colors">+7 (911) 611-57-41</a>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 text-center">
        <p>© {year} «Баня под ключ». Все права защищены.</p>
      </footer>

      {selectedBath && <BathModal bath={selectedBath} onClose={() => setSelectedBath(null)} />}
    </div>
  );
}