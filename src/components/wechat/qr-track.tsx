'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useRef } from 'react';

/**
 * QrTrack — 给二维码加最小埋点，回答「看到码的人里有多少真的去扫」。
 *
 * Vercel Hobby 不支持自定义事件，所以信标打到姊妹站 yotradeapi.com/t
 * （nginx 只回 204 并在 access log 留一行，不存任何内容），事件名统一 llc_ 前缀：
 * - llc_qr_view:  码在视口里停留 ≥1.5s（每页每渠道只记一次；页脚小码不记）
 * - llc_qr_press: 点击 / 长按 / 右键码图（手机上长按识别二维码就是这个动作）
 */

const BEACON = 'https://yotradeapi.com/t';

function send(event: string, path: string, channel: string, variant: string) {
  const qs = new URLSearchParams({ e: event, s: path, c: channel, v: variant });
  const url = `${BEACON}?${qs.toString()}`;
  try {
    if (navigator.sendBeacon?.(url)) return;
    fetch(url, { method: 'POST', mode: 'no-cors', keepalive: true }).catch(
      () => {}
    );
  } catch {
    // 埋点失败不影响页面
  }
}

interface QrTrackProps {
  channel: string;
  variant: 'primary' | 'compact' | 'inline';
  className?: string;
  children: ReactNode;
}

export function QrTrack({
  channel,
  variant,
  className,
  children,
}: QrTrackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const viewed = useRef(false);
  const pressed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    // 页脚小码每页都会被看到，只记 press，不记 view，免得刷屏
    if (variant === 'inline') return;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !viewed.current) {
          timer = setTimeout(() => {
            viewed.current = true;
            send('llc_qr_view', pathname, channel, variant);
            io.disconnect();
          }, 1500);
        } else if (timer) {
          clearTimeout(timer);
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [pathname, channel, variant]);

  const pressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const onPress = () => {
    if (pressed.current) return;
    pressed.current = true;
    send('llc_qr_press', pathname, channel, variant);
  };
  // iOS Safari 长按图片不触发 contextmenu，用 touch 计时兜底
  const onTouchStart = () => {
    pressTimer.current = setTimeout(onPress, 500);
  };
  const onTouchEnd = () => clearTimeout(pressTimer.current);

  return (
    <div
      ref={ref}
      className={className}
      onClick={onPress}
      onContextMenu={onPress}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchMove={onTouchEnd}
    >
      {children}
    </div>
  );
}
