export type FeatureID = 'faceToFace' | 'simultaneous' | 'meeting';

export type FeatureDescriptor = {
  id: FeatureID;
  title: string;
  subtitle: string;
  route: 'conversation' | 'interpretation' | 'meeting';
};

export const featureRegistry: FeatureDescriptor[] = [
  {
    id: 'faceToFace',
    title: '面对面',
    subtitle: '两人隔桌，字幕打到各自一侧',
    route: 'conversation',
  },
  {
    id: 'simultaneous',
    title: '同声传译',
    subtitle: '听现场，看或听译文',
    route: 'interpretation',
  },
  {
    id: 'meeting',
    title: '会议记录',
    subtitle: '把一场会记成完整文字稿',
    route: 'meeting',
  },
];
