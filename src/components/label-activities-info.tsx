import React from 'react';
import Text from './ui/text';
import Icon from './ui/icon';

export interface PropsLabelActivitieInfo {
  text?: string;
  textInfo?: string | null;
  secondTextInfo?: string | null;
  svg?: React.ComponentProps<typeof Icon>['svg'];
  className?: string;
}

const LabelActivitieInfo = ({
  text,
  textInfo,
  secondTextInfo,
  svg,
  className,
}: PropsLabelActivitieInfo) => {
  return (
    <span className={` flex items-center gap-3 ${className} `}>
      <Text variant={'information'} as='span'>
        {text && !svg && (
          <Text as='span' variant={'information'}>
            {text}
          </Text>
        )}
        {!text && svg && <Icon svg={svg} className=' stroke-initial ' />}
      </Text>
      <span className=' px-1.5 py-0.5 border border-border rounded-lg '>
        <Text as='span' variant={'little-text'}>
          {textInfo}
          {secondTextInfo && ` - ${secondTextInfo}`}
        </Text>
      </span>
    </span>
  );
};

export default LabelActivitieInfo;
