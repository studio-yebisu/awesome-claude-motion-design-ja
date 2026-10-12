import {Composition} from 'remotion';
import {ReleaseNotes} from './ReleaseNotes';
import {VariantFilm} from './VariantFilm';
import {WhaleyFilm} from './WhaleyFilm';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="ReleaseNotes" component={ReleaseNotes} width={960} height={600} fps={30} durationInFrames={240}/>
      <Composition id="VariantFilm" component={VariantFilm} width={960} height={600} fps={30} durationInFrames={240}/>
      <Composition id="WhaleyFilm" component={WhaleyFilm} width={960} height={600} fps={30} durationInFrames={240}/>
    </>
  );
};
