import { For } from 'solid-js';
import { Ranking, RankingType } from '@/shared/types';

import { Dialog } from '@/ui/dialog';
import { PlayInfo } from '@/ui/play-info';
import { formatDate } from '@/utils';

import { containerStyle } from './ranking-dialog.css';

export type RankingDialogProps = {
  rankingType?: RankingType | null;
  time: Date | null;
  ranking: Ranking | null | undefined;
  open: boolean;
  onClose: () => void;
};

export const RankingDialog = (props: RankingDialogProps) => (
  <Dialog
    title="시간별 랭킹 보기"
    description={
      props.time
        ? `${formatDate(props.time, 'YYYY-MM-DD HH시')} 기준 랭킹`
        : undefined
    }
    open={props.open}
    onClose={props.onClose}
    zIndex={10002}
  >
    <div class={containerStyle}>
      <For
        each={props.ranking?.videos}
        fallback={<p>해당 시간의 랭킹 데이터가 없습니다.</p>}
      >
        {(video, index) => (
          <PlayInfo
            index={index() + 1}
            ranking={index() + 1}
            rankingType={props.rankingType}
            title={video.title}
            artist={video.owner.name}
            album={video.thumbnail.url}
          />
        )}
      </For>
    </div>
  </Dialog>
);
