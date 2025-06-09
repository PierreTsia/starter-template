import { Link } from 'react-router-dom';

interface FeatureLinkProps {
  title: string;
  description: string;
  href: string;
}

export const FeatureLink = ({ title, description, href }: FeatureLinkProps) => {
  return (
    <Link to={href} className="rounded-md p-3 transition-colors hover:bg-muted/70">
      <div>
        <p className="mb-1 font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
};
