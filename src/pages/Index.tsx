import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Service {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  features: string[];
}

const services: Service[] = [
  {
    id: 'matrix-basic',
    title: 'Базовая матрица судьбы',
    description: 'Полный расчет вашей матрицы судьбы с расшифровкой основных энергий',
    duration: '60 минут',
    price: '5 000 ₽',
    features: ['Расчет личных энергий', 'Кармические задачи', 'Талант и предназначение', 'Письменная расшифровка']
  },
  {
    id: 'consultation',
    title: 'Личная консультация',
    description: 'Индивидуальная работа с разбором вашей матрицы и ответами на вопросы',
    duration: '90 минут',
    price: '8 000 ₽',
    features: ['Детальный разбор матрицы', 'Ответы на личные вопросы', 'Рекомендации по развитию', 'Аудиозапись консультации']
  },
  {
    id: 'compatibility',
    title: 'Матрица совместимости',
    description: 'Анализ совместимости партнеров через матрицу судьбы',
    duration: '75 минут',
    price: '7 000 ₽',
    features: ['Анализ двух матриц', 'Совместимость по энергиям', 'Рекомендации для отношений', 'Совместные кармические задачи']
  }
];

const testimonials = [
  {
    name: 'Елена М.',
    text: 'Матрица судьбы открыла мне глаза на мое истинное предназначение. Теперь я живу в гармонии с собой.',
    rating: 5
  },
  {
    name: 'Дмитрий К.',
    text: 'Консультация помогла понять корни многих проблем. Рекомендации работают, жизнь меняется к лучшему.',
    rating: 5
  },
  {
    name: 'Анна С.',
    text: 'Анализ совместимости с мужем дал понимание наших отношений. Стали ближе друг к другу.',
    rating: 5
  }
];

export default function Index() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedService, setSelectedService] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    '10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00'
  ];

  const handleBooking = async () => {
    if (!selectedDate || !selectedService || !selectedTime || !clientName || !clientPhone) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedServiceData = services.find(s => s.id === selectedService);
      const bookingData = {
        service: selectedServiceData?.title || selectedService,
        date: selectedDate.toLocaleDateString('ru-RU'),
        time: selectedTime,
        clientName,
        clientPhone,
        clientEmail,
        message
      };

      const response = await fetch('https://functions.poehali.dev/f9388ebe-c74c-40ef-87b5-4fee1d07eb06', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('Заявка успешно отправлена! Специалист свяжется с вами в ближайшее время.');
        setBookingDialogOpen(false);
        // Reset form
        setSelectedDate(undefined);
        setSelectedService('');
        setSelectedTime('');
        setClientName('');
        setClientPhone('');
        setClientEmail('');
        setMessage('');
      } else {
        throw new Error(result.error || 'Произошла ошибка при отправке заявки');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Произошла ошибка при отправке заявки. Попробуйте еще раз или свяжитесь с нами напрямую.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Sparkles" size={20} className="text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Матрица Судьбы</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">О матрице</a>
              <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">Услуги</a>
              <a href="#specialist" className="text-muted-foreground hover:text-foreground transition-colors">Специалист</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Отзывы</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Контакты</a>
            </nav>
            <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Icon name="Calendar" size={16} className="mr-2" />
                  Записаться
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-accent/10 to-muted/30"></div>
        <div className="relative container mx-auto max-w-4xl animate-fade-in">
          <div className="mb-8">
            <img 
              src="/img/cd20c627-8d9d-4e92-96cb-ecfcfe284edd.jpg" 
              alt="Матрица судьбы" 
              className="w-24 h-24 mx-auto rounded-full shadow-lg animate-scale-in"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Откройте свою <span className="text-primary">Матрицу Судьбы</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Древняя мудрость нумерологии поможет раскрыть ваше истинное предназначение, 
            кармические задачи и путь к гармонии
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                  <Icon name="Sparkles" size={20} className="mr-2" />
                  Получить консультацию
                </Button>
              </DialogTrigger>
            </Dialog>
            <Button size="lg" variant="outline" className="px-8">
              <Icon name="Book" size={20} className="mr-2" />
              Узнать подробнее
            </Button>
          </div>
        </div>
      </section>

      {/* About Matrix Section */}
      <section id="about" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Что такое Матрица Судьбы?
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Это мощный инструмент самопознания, основанный на древних знаниях арканов Таро 
              и нумерологических расчетов по дате рождения
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center animate-fade-in">
              <CardHeader>
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="User" size={28} className="text-secondary-foreground" />
                </div>
                <CardTitle>Личность</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Раскройте свои скрытые таланты, сильные стороны и области для развития
                </p>
              </CardContent>
            </Card>
            <Card className="text-center animate-fade-in" style={{animationDelay: '0.2s'}}>
              <CardHeader>
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Heart" size={28} className="text-accent-foreground" />
                </div>
                <CardTitle>Отношения</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Поймите динамику ваших отношений и найдите гармонию с близкими
                </p>
              </CardContent>
            </Card>
            <Card className="text-center animate-fade-in" style={{animationDelay: '0.4s'}}>
              <CardHeader>
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Target" size={28} className="text-primary-foreground" />
                </div>
                <CardTitle>Предназначение</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Откройте свою жизненную миссию и найдите путь к истинному счастью
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Наши Услуги
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Выберите подходящий формат работы с вашей матрицей судьбы
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={service.id} className="relative animate-fade-in hover:shadow-lg transition-all duration-300" style={{animationDelay: `${index * 0.2}s`}}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <Badge variant="secondary">{service.price}</Badge>
                  </div>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-muted-foreground">
                      <Icon name="Clock" size={16} className="mr-2" />
                      <span>{service.duration}</span>
                    </div>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <Icon name="Check" size={16} className="mr-2 text-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full" onClick={() => setSelectedService(service.id)}>
                          Выбрать услугу
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specialist Section */}
      <section id="specialist" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="w-48 h-48 bg-gradient-to-br from-secondary to-accent rounded-full mx-auto mb-8 flex items-center justify-center">
                <Icon name="User" size={80} className="text-white" />
              </div>
            </div>
            <div className="animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Анна Светлова
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg">
                  Сертифицированный специалист по матрице судьбы с 8-летним опытом работы.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Icon name="Award" size={16} className="mr-3 text-primary" />
                    <span>Более 2000 проведенных консультаций</span>
                  </div>
                  <div className="flex items-center">
                    <Icon name="Star" size={16} className="mr-3 text-primary" />
                    <span>Обучение в Международной Академии Нумерологии</span>
                  </div>
                  <div className="flex items-center">
                    <Icon name="Heart" size={16} className="mr-3 text-primary" />
                    <span>Индивидуальный подход к каждому клиенту</span>
                  </div>
                </div>
                <p className="text-lg italic">
                  "Моя миссия — помочь людям найти свой истинный путь и жить в гармонии со своей природой"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Отзывы клиентов
            </h2>
            <p className="text-muted-foreground text-lg">
              Что говорят люди, познавшие свою матрицу судьбы
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="animate-fade-in" style={{animationDelay: `${index * 0.2}s`}}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Icon key={i} name="Star" size={16} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="font-semibold text-foreground">
                    — {testimonial.name}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Контакты
            </h2>
            <p className="text-muted-foreground text-lg">
              Свяжитесь со мной для записи на консультацию
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                  <Icon name="Phone" size={20} className="text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Телефон</div>
                  <div className="text-muted-foreground">+7 (999) 123-45-67</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                  <Icon name="Mail" size={20} className="text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Email</div>
                  <div className="text-muted-foreground">info@matrix-destiny.ru</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                  <Icon name="MessageCircle" size={20} className="text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Telegram</div>
                  <div className="text-muted-foreground">@matrix_destiny</div>
                </div>
              </div>
            </div>
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Быстрая связь</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <Input placeholder="Ваше имя" />
                  <Input type="email" placeholder="Email" />
                  <Input placeholder="Телефон" />
                  <Textarea placeholder="Сообщение или вопрос" />
                  <Button className="w-full">
                    <Icon name="Send" size={16} className="mr-2" />
                    Отправить сообщение
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Booking Dialog */}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Запись на консультацию</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-4">Выберите услугу</h4>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите услугу" />
              </SelectTrigger>
              <SelectContent>
                {services.map(service => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.title} - {service.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <h4 className="font-semibold mb-4 mt-6">Выберите время</h4>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите время" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map(time => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Выберите дату</h4>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date.getDay() === 0}
              className="rounded-md border"
            />
          </div>
        </div>
        
        <div className="space-y-4 mt-6">
          <h4 className="font-semibold">Ваши контактные данные</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <Input 
              placeholder="Ваше имя *" 
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
            <Input 
              placeholder="Телефон *" 
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
            />
          </div>
          <Input 
            type="email"
            placeholder="Email (необязательно)" 
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
          />
          <Textarea 
            placeholder="Дополнительное сообщение (необязательно)" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        
        <div className="flex justify-end space-x-4 mt-6">
          <Button variant="outline" onClick={() => setBookingDialogOpen(false)}>
            Отмена
          </Button>
          <Button 
            onClick={handleBooking} 
            disabled={!selectedDate || !selectedService || !selectedTime || !clientName || !clientPhone || isSubmitting}
          >
            {isSubmitting ? 'Отправка...' : 'Записаться'}
          </Button>
        </div>
      </DialogContent>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Sparkles" size={16} className="text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">Матрица Судьбы</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 Матрица Судьбы. Откройте путь к гармонии и самопознанию.
          </p>
        </div>
      </footer>
    </div>
  );
}