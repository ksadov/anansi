import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

// via https://github.com/shadcn-ui/ui/discussions/1694#discussioncomment-8167582

const Loader = ({ className }: { className?: string }) => {
  return (
    <Loader2
      className={cn('animate-spin', className)}
    />
  );
};

export default Loader;