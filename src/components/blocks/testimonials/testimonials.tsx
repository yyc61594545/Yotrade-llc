import { HeaderSection } from '@/components/layout/header-section';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

type Testimonial = {
  name: string;
  role: string;
  image: string;
  quote: string;
};

const chunkArray = (
  array: Testimonial[],
  chunkSize: number
): Testimonial[][] => {
  const result: Testimonial[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

export default function TestimonialsSection() {
  const t = useTranslations('HomePage.testimonials');

  const testimonials: Testimonial[] = [
    {
      name: t('items.item-1.name'),
      role: '',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      quote: t('items.item-1.quote'),
    },
    {
      name: t('items.item-2.name'),
      role: '',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      quote: t('items.item-2.quote'),
    },
    {
      name: t('items.item-3.name'),
      role: '',
      image: 'https://randomuser.me/api/portraits/men/46.jpg',
      quote: t('items.item-3.quote'),
    },
    {
      name: t('items.item-4.name'),
      role: '',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      quote: t('items.item-4.quote'),
    },
    {
      name: t('items.item-5.name'),
      role: '',
      image: 'https://randomuser.me/api/portraits/men/86.jpg',
      quote: t('items.item-5.quote'),
    },
    {
      name: t('items.item-6.name'),
      role: '',
      image: 'https://randomuser.me/api/portraits/women/21.jpg',
      quote: t('items.item-6.quote'),
    },
    {
      name: t('items.item-7.name'),
      role: '',
      image: 'https://randomuser.me/api/portraits/men/22.jpg',
      quote: t('items.item-7.quote'),
    },
    {
      name: t('items.item-8.name'),
      role: '',
      image: 'https://randomuser.me/api/portraits/women/65.jpg',
      quote: t('items.item-8.quote'),
    },
    {
      name: t('items.item-9.name'),
      role: '',
      image: 'https://randomuser.me/api/portraits/men/54.jpg',
      quote: t('items.item-9.quote'),
    },
    {
      name: t('items.item-10.name'),
      role: '',
      image: 'https://randomuser.me/api/portraits/women/90.jpg',
      quote: t('items.item-10.quote'),
    },
    {
      name: t('items.item-11.name'),
      role: '',
      image: 'https://randomuser.me/api/portraits/men/71.jpg',
      quote: t('items.item-11.quote'),
    },
    {
      name: t('items.item-12.name'),
      role: '',
      image: 'https://randomuser.me/api/portraits/women/32.jpg',
      quote: t('items.item-12.quote'),
    },
  ];

  const testimonialChunks = chunkArray(
    testimonials,
    Math.ceil(testimonials.length / 3)
  );

  return (
    <section id="testimonials" className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-balance text-3xl font-semibold md:text-4xl">
            {t('title')}
          </h2>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
          {testimonialChunks.map((chunk, chunkIndex) => (
            <div key={chunkIndex} className="space-y-3">
              {chunk.map(({ name, role, quote, image }, index) => (
                <Card
                  key={index}
                  className="shadow-none bg-transparent hover:bg-accent dark:hover:bg-card"
                >
                  <CardContent className="grid grid-cols-[auto_1fr] gap-3 pt-4">
                    <Avatar className="size-9 border-2 border-gray-200">
                      <AvatarImage
                        alt={name}
                        src={image}
                        loading="lazy"
                        width="120"
                        height="120"
                      />
                      <AvatarFallback />
                    </Avatar>

                    <div>
                      <h3 className="font-medium">{name}</h3>

                      <blockquote className="mt-3">
                        <p className="text-gray-700 dark:text-gray-300">
                          {quote}
                        </p>
                      </blockquote>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
