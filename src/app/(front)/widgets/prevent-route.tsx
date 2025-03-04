import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function PreventRoute(props: {
  isUploading: boolean;
  message?: string;
}) {
  const defaultMessage = "작성한 글을 지우고 페이지를 나가시겠습니까?";
  const { isUploading, message } = props;
  const router = useRouter();

  // 뒤로가기 제한
  const isClickedFirst = useRef(false);

  useEffect(() => {
    if (!isClickedFirst.current) {
      history.pushState(null, "", "");
      isClickedFirst.current = true;
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      // 페이지를 벗어나지 않아야 하는 경우
      if (!confirm(message ?? defaultMessage)) {
        history.pushState(null, "", "");
        return;
      }

      history.back();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [message]);

  // 새로고침, 나가기 제한
  useEffect(() => {
    const handleUnload = (e: BeforeUnloadEvent) => {
      // form 입력 중일 때만, 그러나 submit 버튼을 누르면 이동을 하기 때문에 submit은 제외하고
      if (!isUploading) {
        e.preventDefault();
        e.returnValue = true; // for legacy browsers
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [isUploading]);

  // 페이지 이동 제한
  useEffect(() => {
    const originalPush = router.push;
    console.log(originalPush);

    router.push = (
      href: string,
      options?: NavigateOptions | undefined,
    ): void => {
      console.log(isUploading);
      if (!isUploading) {
        if (!confirm(message ?? defaultMessage)) {
          return;
        }
      }
      originalPush(href, options);
      return;
    };
    return () => {
      router.push = originalPush;
    };
  }, [isUploading, message, router]);

  return <div />;
}
