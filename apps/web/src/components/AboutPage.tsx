import { Shield, Type, TestTube2, Rocket, Github } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Page } from '@/components/ui/page';
import { PageTitle } from '@/components/ui/page-title';
import { useTranslation } from '@/i18n/hooks/useTranslation';

const defaultTechStack = [
  {
    src: 'https://raw.githubusercontent.com/vitejs/vite/main/docs/public/logo.svg',
    alt: 'Vite',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    alt: 'React',
  },
  {
    src: 'https://docs.nestjs.com/assets/logo-small.svg',
    alt: 'NestJS',
  },
  {
    src: 'https://raw.githubusercontent.com/prisma/presskit/main/Assets/Prisma-IndigoLogo.svg',
    alt: 'Prisma',
  },
  {
    src: 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg',
    alt: 'Tailwind',
  },
  {
    src: 'https://raw.githubusercontent.com/TanStack/query/main/media/repo-dark.png',
    alt: 'TanStack Query',
  },
];

const defaultFeatures = [
  {
    label: 'Authentication',
    value: 'JWT with refresh token',
    icon: Shield,
  },
  {
    label: 'Type Safety',
    value: '100% TypeScript',
    icon: Type,
  },
  {
    label: 'Testing',
    value: 'Vitest + Jest',
    icon: TestTube2,
  },
  {
    label: 'Deployment',
    value: 'Vercel + Render',
    icon: Rocket,
  },
];

export const AboutPage = () => {
  const { t } = useTranslation();
  return (
    <Page>
      <PageTitle title={t('about.title')} description={t('about.description')} />
      <div className="grid gap-7 lg:grid-cols-3">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
          alt="tech workspace background"
          className="size-full max-h-[620px] rounded-xl object-cover lg:col-span-2"
        />
        <div className="flex flex-col gap-7 md:flex-row lg:flex-col h-full lg:justify-end">
          <div className="flex flex-col justify-between gap-6 rounded-xl bg-muted p-7 md:w-1/2 lg:w-auto">
            <div>
              <p className="mb-2 text-lg font-semibold">{t('about.ctaTitle')}</p>
              <p className="text-muted-foreground">{t('about.ctaDescription')}</p>
            </div>
            <Button variant="info" className="mr-auto flex items-center gap-2" asChild>
              <a
                href="https://github.com/PierreTsia/starter-template"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                {t('about.ctaButton')}
              </a>
            </Button>
          </div>
        </div>
      </div>
      <div className="py-32">
        <p className="text-center">{t('about.techStackTitle')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-8">
          {defaultTechStack.map((tech, idx) => (
            <div className="flex items-center gap-3" key={tech.src + idx}>
              <img src={tech.src} alt={tech.alt} className="h-6 w-auto md:h-8" />
            </div>
          ))}
        </div>
      </div>
      <div className="relative overflow-hidden rounded-xl bg-muted p-10 md:p-16">
        <div className="flex flex-col gap-4 text-center md:text-left">
          <h2 className="text-4xl font-semibold">{t('about.featuresTitle')}</h2>
          <p className="max-w-xl text-muted-foreground">{t('about.featuresDescription')}</p>
        </div>
        <div className="mt-10 flex flex-wrap justify-between gap-10 text-center">
          {defaultFeatures.map((item, idx) => (
            <div className="flex flex-col gap-4" key={item.label + idx}>
              <div className="flex justify-center">
                <item.icon className="h-6 w-6 text-indigo-500" />
              </div>
              <p>{item.label}</p>
              <span className="text-2xl font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute -top-1 right-1 z-10 hidden h-full w-full bg-[linear-gradient(to_right,hsl(var(--muted-foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted-foreground))_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom_right,#000,transparent,transparent)] bg-[size:80px_80px] opacity-15 md:block"></div>
      </div>
    </Page>
  );
};
