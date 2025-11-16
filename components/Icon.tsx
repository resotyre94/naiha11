
import React from 'react';
import * as HIcons from '@heroicons/react/24/outline';

type IconName = keyof typeof HIcons;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
}

const Icon: React.FC<IconProps> = ({ name, ...props }) => {
    // A bit of a hack to get around type indexing issues
    const iconName = name as IconName;
    if (!(iconName in HIcons)) {
        // Fallback icon
        const FallbackIcon = HIcons['QuestionMarkCircleIcon'];
        return <FallbackIcon {...props} />;
    }
    const IconComponent = HIcons[iconName];
    return <IconComponent {...props} />;
};

export default Icon;
