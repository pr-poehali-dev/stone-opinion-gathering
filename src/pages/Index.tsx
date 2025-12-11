import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface Poll {
  id: number;
  question: string;
  options: { id: number; text: string; votes: number }[];
  totalVotes: number;
  endDate: string;
}

interface NewsItem {
  id: number;
  title: string;
  date: string;
  category: string;
  excerpt: string;
}

const API_URL = 'https://functions.poehali.dev/88aa3fd2-4e67-4f28-a393-a28756b91198';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [joinButtonClicked, setJoinButtonClicked] = useState(false);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setPolls(data.polls);
    } catch (error) {
      console.error('Ошибка загрузки опросов:', error);
    } finally {
      setLoading(false);
    }
  };

  const news: NewsItem[] = [
    {
      id: 1,
      title: 'Толик снова не послушал камень и купил не те носки',
      date: '10 декабря 2025',
      category: 'Срочно',
      excerpt: 'Древний гранитный валун предупреждал его о последствиях, но Толик, как обычно, всё проигнорировал. Носки оказались с дырками.'
    },
    {
      id: 2,
      title: 'Камни всего мира объединились против решений Толика',
      date: '8 декабря 2025',
      category: 'Геологический кризис',
      excerpt: 'На экстренном совещании минералов было принято решение: мнение Толика больше не учитывается при принятии важных решений.'
    },
    {
      id: 3,
      title: 'Булыжник с соседнего двора подал в суд на Толика',
      date: '5 декабря 2025',
      category: 'Юридические новости',
      excerpt: 'Иск на 3 миллиона рублей за моральный ущерб: Толик наступил на булыжник, не извинился, и теперь будет отвечать перед каменным судом.'
    }
  ];

  const leaders = [
    {
      name: 'Ярик Кремний',
      role: 'Основатель партии',
      bio: 'Единственный человек, который понял: если хочешь принимать правильные решения — делай всё наоборот от Толика'
    },
    {
      name: 'Никита Стоун',
      role: 'Главный советник',
      bio: 'Камень возрастом 3 млн лет. За это время повидал много глупостей, но Толик превзошёл все ожидания'
    },
    {
      name: 'Никита Булыжник',
      role: 'Координатор движения',
      bio: 'Организует мероприятия по повышению осознанности. Главный лозунг: "Спроси сначала камень, потом Толика, сделай наоборот"'
    }
  ];

  const handleVote = async (pollId: number, optionId: number) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poll_id: pollId, option_id: optionId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPolls(polls.map(poll => {
          if (poll.id === pollId) {
            return {
              ...poll,
              options: data.options,
              totalVotes: data.totalVotes
            };
          }
          return poll;
        }));
      }
    } catch (error) {
      console.error('Ошибка голосования:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🪨</span>
              </div>
              <h1 className="text-2xl font-heading font-bold text-gray-900">Мнение Камня</h1>
            </div>
            <div className="hidden md:flex gap-6">
              {[
                { id: 'home', label: 'Главная', icon: 'Home' },
                { id: 'news', label: 'Новости', icon: 'Newspaper' },
                { id: 'vote', label: 'Голосование', icon: 'Vote' },
                { id: 'about', label: 'О партии', icon: 'Users' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeSection === item.id
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon name={item.icon as any} size={18} />
                  {item.label}
                </button>
              ))}
            </div>
            <Button 
              className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold"
              onClick={() => setJoinButtonClicked(true)}
            >
              {joinButtonClicked ? 'вы не уважаете Толика' : 'Присоединиться'}
            </Button>
          </div>
        </div>
      </nav>

      {activeSection === 'home' && (
        <div>
          <section className="relative py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-95"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzRhNWU2OCIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIuMiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <Badge className="mb-6 bg-amber-500 text-gray-900 px-4 py-2 text-sm font-semibold">
                  🪨 Потому что Толик опять всё испортил
                </Badge>
                <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-6 animate-fade-in leading-tight">
                  Мнение камня важнее мнения Толика
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-10 animate-fade-in font-light leading-relaxed">
                  Мы объединяем людей, которые устали от решений Толика. Камни молчат миллионы лет — 
                  и это уже мудрее, чем всё, что говорит Толик. Присоединяйся к движению здравого смысла!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
                  <Button 
                    size="lg" 
                    className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                    onClick={() => setJoinButtonClicked(true)}
                  >
                    <Icon name="Users" className="mr-2" />
                    {joinButtonClicked ? 'вы не уважаете Толика' : 'Вступить в партию'}
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold text-lg px-8 py-6 transition-all hover:scale-105"
                    onClick={() => setActiveSection('about')}
                  >
                    <Icon name="BookOpen" className="mr-2" />
                    Узнать больше
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-heading font-bold text-center text-gray-900 mb-4">
                Почему камень {'>'} Толик
              </h2>
              <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                Научные доказательства превосходства камней над решениями Толика
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: '🗿',
                    title: 'Камень молчит',
                    description: 'Камни не дают вредных советов. В отличие от Толика, который советует купить криптовалюту на последние деньги.'
                  },
                  {
                    icon: '⚖️',
                    title: 'Камень не ошибается',
                    description: 'Камень лежит на месте миллионы лет — и ни разу не накосячил. Толик накосячил уже три раза за сегодня.'
                  },
                  {
                    icon: '🌍',
                    title: 'Камень надёжнее',
                    description: 'На камень можно опереться. На мнение Толика опереться нельзя — оно меняется каждые 5 минут.'
                  }
                ].map((principle, index) => (
                  <Card key={index} className="border-2 hover:border-amber-500 transition-all hover:shadow-xl hover:-translate-y-2 duration-300">
                    <CardHeader>
                      <div className="text-6xl mb-4">{principle.icon}</div>
                      <CardTitle className="text-2xl font-heading text-gray-900">{principle.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">{principle.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {activeSection === 'news' && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-heading font-bold text-center text-gray-900 mb-4">
              Хроники неудач Толика
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
              Свежие доказательства того, что камни правы, а Толик — нет
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {news.map(item => (
                <Card key={item.id} className="hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-amber-500 text-gray-900">{item.category}</Badge>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Icon name="Calendar" size={14} />
                        {item.date}
                      </span>
                    </div>
                    <CardTitle className="text-xl font-heading font-bold text-gray-900 leading-snug hover:text-amber-600 transition-colors">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed mb-4">{item.excerpt}</p>
                    <Button variant="link" className="text-amber-600 p-0 font-semibold">
                      Читать полностью →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeSection === 'vote' && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-heading font-bold text-center text-gray-900 mb-4">
              Голосуем против Толика
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
              Помоги камням принять правильное решение. Главное — делай наоборот от того, что посоветовал бы Толик.
            </p>
            <div className="max-w-4xl mx-auto space-y-8">
              {polls.map(poll => (
                <Card key={poll.id} className="border-2 shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-2xl font-heading font-bold text-gray-900 flex-1 pr-4">
                        {poll.question}
                      </CardTitle>
                      <Badge variant="outline" className="border-amber-500 text-amber-700 whitespace-nowrap">
                        <Icon name="Clock" size={14} className="mr-1" />
                        до {poll.endDate}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-600">
                      Всего голосов: <span className="font-semibold text-gray-900">{poll.totalVotes}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loading ? (
                      <p className="text-center text-gray-500">Загрузка...</p>
                    ) : (
                      poll.options.map((option) => {
                        const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes * 100).toFixed(1) : 0;
                        return (
                          <div key={option.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">{option.text}</span>
                              <span className="text-sm text-gray-600 font-semibold">{percentage}%</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Progress value={Number(percentage)} className="flex-1 h-3" />
                              <Button
                                size="sm"
                                onClick={() => handleVote(poll.id, option.id)}
                                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold"
                              >
                                <Icon name="ThumbsUp" size={16} />
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500">{option.votes} голосов</p>
                          </div>
                        );
                      })
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeSection === 'about' && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-heading font-bold text-center text-gray-900 mb-4">
              О партии анти-Толика
            </h2>
            <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto text-lg">
              Как всё началось, кто мы такие, и почему Толик до сих пор не понял намёка
            </p>
            
            <div className="max-w-4xl mx-auto mb-20">
              <Card className="border-2 shadow-xl bg-gradient-to-br from-white to-gray-50">
                <CardHeader>
                  <CardTitle className="text-3xl font-heading font-bold text-gray-900">
                    Наша анти-Толик миссия
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-700 leading-relaxed text-lg">
                  <p>
                    Партия "Мнение Камня" основана в 2024 году группой людей, которые устали от недовольства Толика. 
                    И в один чудесный день сидя и рассуждая над причиной мироздания и в голову одно из тройки великих камней пришла в голову глубочайшая мысль "а разве мнение камня не важнее мнения Толика?" после этого мы провели бессонные ночи выясняя это. МЫ защитили несколько научных работ по этой теме и выяснили , МНЕНИЕ КАМНЯ ВАЖНЕЕ.
                  </p>
                  <p>
                    Мы верим, что даже самый обычный булыжник с дороги размышляет лучше, чем Толик. 
                    Камни молчат — и это их главное преимущество. Толик не молчит — и это его главная проблема.
                  </p>
                  <p className="font-semibold text-gray-900">
                    Наша цель — сделать так, чтобы мнение камней учитывалось чаще, чем мнение Толика. 
                    А в идеале — чтобы Толика вообще не спрашивали.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-3xl font-heading font-bold text-center text-gray-900 mb-10">
                Лидеры анти-Толик движения
              </h3>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {leaders.map((leader, index) => (
                  <Card key={index} className="border-2 hover:border-amber-500 transition-all hover:shadow-xl hover:-translate-y-2 duration-300">
                    <CardHeader>
                      <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-4xl">
                        {index === 1 ? '🪨' : '👤'}
                      </div>
                      <CardTitle className="text-center text-xl font-heading font-bold text-gray-900">
                        {leader.name}
                      </CardTitle>
                      <CardDescription className="text-center text-amber-600 font-semibold">
                        {leader.role}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center leading-relaxed">{leader.bio}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🪨</span>
                <h3 className="text-xl font-heading font-bold">Мнение Камня</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Партия нового поколения, объединяющая человека и природу
              </p>
            </div>
            <div>
              <h4 className="font-heading font-bold mb-4">Разделы</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-amber-500 transition-colors">Главная</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Новости</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Голосование</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">О партии</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-bold mb-4">Контакты</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  info@mnenie-kamnya.ru
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  +7 (495) 123-45-67
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="MapPin" size={16} />
                  Москва, ул. Каменная, 1
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-bold mb-4">Социальные сети</h4>
              <div className="flex gap-3">
                {['Facebook', 'Twitter', 'Instagram', 'Youtube'].map(social => (
                  <button 
                    key={social}
                    className="w-10 h-10 bg-gray-800 hover:bg-amber-500 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  >
                    <Icon name={social as any} size={18} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 Партия "Мнение Камня". Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;