import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';

export async function votePoll(pollId: string, optionId: string): Promise<void> {
  const callable = httpsCallable<
    { pollId: string; optionId: string },
    { success: boolean }
  >(functions, 'votePollCallable');

  await callable({ pollId, optionId });
}
