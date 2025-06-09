import { Link } from 'react-router-dom';

import { FeatureLink } from './FeatureLink';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useNavFeatureItems } from '@/hooks/useNavFeatureItems';
import { useTranslation } from '@/i18n/hooks/useTranslation';

export const MobileLinks = () => {
  const { t } = useTranslation();
  const features = useNavFeatureItems();

  return (
    <>
      <Accordion type="single" collapsible className="mt-4 mb-2">
        <AccordionItem value="solutions" className="border-none">
          <AccordionTrigger className="text-base hover:no-underline">
            {t('navbar.features.title')}
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid md:grid-cols-2">
              {features.map((feature, index) => (
                <FeatureLink
                  key={index}
                  title={feature.title}
                  description={feature.description}
                  href={feature.href}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex flex-col gap-6">
        <Link to="/about" className="font-medium">
          {t('navbar.links.about')}
        </Link>
        <Link to="/tasks" className="font-medium">
          {t('navbar.links.tasks')}
        </Link>
        <Link to="/settings" className="font-medium">
          {t('navbar.links.settings')}
        </Link>
        <Link to="/contact" className="font-medium">
          {t('navbar.links.contact')}
        </Link>
      </div>
    </>
  );
};
