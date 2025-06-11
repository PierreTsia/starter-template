import { Shield, Type, TestTube2, Rocket, Github } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Page } from '@/components/ui/page';
import { PageTitle } from '@/components/ui/page-title';

interface About3Props {
  title?: string;
  description?: string;
  mainImage?: {
    src: string;
    alt: string;
  };
  secondaryImage?: {
    src: string;
    alt: string;
  };
  breakout?: {
    src: string;
    alt: string;
    title?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  techStackTitle?: string;
  techStack?: Array<{
    src: string;
    alt: string;
  }>;
  featuresTitle?: string;
  featuresDescription?: string;
  features?: Array<{
    label: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
}

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

export const AboutPage = ({
  title = 'About This Template',
  description = 'A minimal but production-ready monorepo template for full-stack TypeScript applications. Designed to be cloned and extended for new projects, with a focus on developer experience and best practices.',
  mainImage = {
    src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c', // Tech workspace, monitors, code
    alt: 'tech workspace background',
  },

  breakout = {
    src: 'https://shadcnblocks.com/images/block/block-1.svg',
    alt: 'logo',
    title: 'Ready to Start Your Next Project?',
    description:
      'This template provides everything you need to build a modern web application: authentication, database integration, API structure, and a beautiful UI.',
    buttonText: 'Get Started',
    buttonUrl: 'https://github.com/PierreTsia/starter-template',
  },
  techStackTitle = 'Built with Modern Technologies',
  techStack = defaultTechStack,
  featuresTitle = 'Key Features',
  featuresDescription = 'Everything you need to build a production-ready application, with a focus on developer experience and best practices.',
  features = defaultFeatures,
}: About3Props = {}) => {
  return (
    <Page>
      <PageTitle title={title} description={description} />
      <div className="grid gap-7 lg:grid-cols-3">
        <img
          src={mainImage.src}
          alt={mainImage.alt}
          className="size-full max-h-[620px] rounded-xl object-cover lg:col-span-2"
        />
        <div className="flex flex-col gap-7 md:flex-row lg:flex-col h-full lg:justify-end">
          <div className="flex flex-col justify-between gap-6 rounded-xl bg-muted p-7 md:w-1/2 lg:w-auto">
            <div>
              <p className="mb-2 text-lg font-semibold">{breakout.title}</p>
              <p className="text-muted-foreground">{breakout.description}</p>
            </div>
            <Button variant="info" className="mr-auto flex items-center gap-2" asChild>
              <a href={breakout.buttonUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" aria-hidden="true" />
                {breakout.buttonText}
              </a>
            </Button>
          </div>
        </div>
      </div>
      <div className="py-32">
        <p className="text-center">{techStackTitle}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-8">
          {techStack.map((tech, idx) => (
            <div className="flex items-center gap-3" key={tech.src + idx}>
              <img src={tech.src} alt={tech.alt} className="h-6 w-auto md:h-8" />
            </div>
          ))}
        </div>
      </div>
      <div className="relative overflow-hidden rounded-xl bg-muted p-10 md:p-16">
        <div className="flex flex-col gap-4 text-center md:text-left">
          <h2 className="text-4xl font-semibold">{featuresTitle}</h2>
          <p className="max-w-xl text-muted-foreground">{featuresDescription}</p>
        </div>
        <div className="mt-10 flex flex-wrap justify-between gap-10 text-center">
          {features.map((item, idx) => (
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
