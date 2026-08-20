import { Dialog } from '@/ui/dialog';
import { createMemo, createResource, For } from 'solid-js';
import { fetchHistory, fetchHistoryRange } from '../../api/ranking';
import { RankingType } from '@/shared/types';
import { formatDate, formatTime } from '@/utils';
import { containerStyle } from './history-dialog.css';
import { actionStyle } from '@/ui/dialog/dialog.css';

export type HistoryDialogProps = {
  type?: RankingType;
  season?: string;
  open?: boolean;
  onClose?: () => void;
  onTime?: (time: Date) => void;
};
export const HistoryDialog = (props: HistoryDialogProps) => {
  const [range] = createResource(
    () => [props.type, props.season] as const,
    ([type, season]) => (type && season) ? fetchHistoryRange(type, season) : null,
  );

  const timeList = createMemo(() => {
    const rangeData = range();

    if (!rangeData) return [];

    const times: Date[] = [];

    const start = new Date(rangeData.start);
    let end = new Date(rangeData.end);
    const now = new Date();
    if (end > now) end = now;

    for (let time = start; time <= end; time.setHours(time.getHours() + 1)) {
      times.push(new Date(time));
    }

    return times;
  });

  return (
    <Dialog
      title={'시간별 랭킹 보기'}
      open={props.open}
      onClose={props.onClose}
    >
      <div class={containerStyle}>
        <For each={timeList()} fallback={'데이터가 없습니다'}>
          {(time) => (
            <button
              class={actionStyle.default}
              onClick={() => {
                fetchHistory(props.type!, time, time).then((it) => {
                  console.log('히스토리 데이터', it);
                });
                props.onTime?.(time)
              }}
            >
              {formatDate(time, 'YYYY-MM-DD HH시')} 기준 랭킹 보기
            </button>
          )}
        </For>
      </div>
    </Dialog>
  );
};
