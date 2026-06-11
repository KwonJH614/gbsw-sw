import { useEffect, useState } from 'react';
import { notificationApi, type NotificationSubscription } from '../../api/notification.api';

export default function DiscordSubscriptionCard() {
  const [subscription, setSubscription] = useState<NotificationSubscription | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    notificationApi.getSubscription().then(setSubscription).catch(() => setMessage('구독 정보를 불러오지 못했습니다.'));
  }, []);

  const run = async (action: () => Promise<unknown>, successMessage: string) => {
    setBusy(true);
    setMessage('');
    try {
      await action();
      setSubscription(await notificationApi.getSubscription());
      setMessage(successMessage);
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { error?: { message?: string } } } };
      setMessage(apiError.response?.data?.error?.message ?? '요청 처리에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mb-8 rounded-xl border border-border bg-surface p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Discord 학습 독려 알림</h2>
          <p className="text-sm text-text-secondary">7일 동안 학습하지 않으면 매일 오전 9시에 알림을 보냅니다.</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${subscription?.subscribed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {subscription?.subscribed ? '구독 중' : '미구독'}
        </span>
      </div>
      <input type="url" value={webhookUrl} onChange={event => setWebhookUrl(event.target.value)}
        placeholder="https://discord.com/api/webhooks/..." maxLength={500}
        className="mb-3 w-full rounded-lg border border-border px-3 py-2 text-sm" />
      <div className="flex flex-wrap gap-2">
        <button disabled={busy || !webhookUrl}
          onClick={() => run(() => notificationApi.subscribe(webhookUrl), 'Discord 구독을 저장했습니다.')}
          className="rounded-lg bg-primary px-4 py-2 text-sm text-white disabled:opacity-50">구독 저장</button>
        <button disabled={busy || !subscription?.subscribed}
          onClick={() => run(() => notificationApi.test(), '테스트 알림을 전송했습니다.')}
          className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-50">테스트 전송</button>
        <button disabled={busy || !subscription?.subscribed}
          onClick={() => run(() => notificationApi.unsubscribe(), 'Discord 구독을 해지했습니다.')}
          className="rounded-lg border border-error/30 px-4 py-2 text-sm text-error disabled:opacity-50">구독 해지</button>
      </div>
      {subscription?.lastTestedAt && <p className="mt-3 text-xs text-text-secondary">최근 테스트: {subscription.lastTestedAt.replace('T', ' ').slice(0, 16)}</p>}
      {message && <p className="mt-3 text-sm text-text-secondary">{message}</p>}
    </section>
  );
}
