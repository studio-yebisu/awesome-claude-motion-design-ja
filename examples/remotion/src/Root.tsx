import {Composition} from 'remotion';
import {ReleaseNotes} from './ReleaseNotes';
import {VariantFilm} from './VariantFilm';
import {WhaleyFilm} from './WhaleyFilm';
import {PromoFilm} from './PromoFilm';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="ReleaseNotes" component={ReleaseNotes} width={960} height={600} fps={30} durationInFrames={240}/>
      <Composition id="VariantFilm" component={VariantFilm} width={960} height={600} fps={30} durationInFrames={240}/>
      <Composition id="WhaleyFilm" component={WhaleyFilm} width={960} height={600} fps={30} durationInFrames={240}/>
      <Composition id="PromoFilm" component={PromoFilm} width={1920} height={1080} fps={30} durationInFrames={1200} defaultProps={{withMusic: false}}/>
    </>
  );
};
