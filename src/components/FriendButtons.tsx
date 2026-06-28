"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  acceptRequestAction,
  removeFriendAction,
  sendRequestAction,
} from "@/app/friends/actions";
import type { FriendState } from "@/lib/types";
import { showToast } from "./Toast";

const baseBtn =
  "text-sm px-3 py-1.5 rounded-md font-medium transition-colors duration-150 disabled:opacity-60";

export function AddFriendButton({
  userId,
  state,
}: {
  userId: number;
  state: FriendState;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [localState, setLocalState] = useState<FriendState>(state);

  const run = (
    fn: () => Promise<{ ok: boolean; message?: string }>,
    optimistic: FriendState,
    successMsg: string,
  ) => {
    startTransition(async () => {
      const res = await fn();
      if (res.ok) {
        setLocalState(optimistic);
        showToast(successMsg, "success");
        router.refresh();
      } else {
        showToast(res.message ?? "Something went wrong", "error");
      }
    });
  };

  if (localState === "self") return null;

  if (localState === "friends") {
    return (
      <span className="text-sm text-brand-700 dark:text-brand-400 font-medium px-2">
        ✓ Friends
      </span>
    );
  }

  if (localState === "outgoing") {
    return (
      <button
        type="button"
        disabled={pending}
        onClick={() => run(() => removeFriendAction(userId), "none", "Request cancelled")}
        className={`${baseBtn} border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-red-400 hover:text-red-600`}
      >
        Requested · Cancel
      </button>
    );
  }

  if (localState === "incoming") {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            run(() => acceptRequestAction(userId), "friends", "You're now friends")
          }
          className={`${baseBtn} bg-brand-600 hover:bg-brand-700 text-white`}
        >
          Accept
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => removeFriendAction(userId), "none", "Request declined")}
          className={`${baseBtn} border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400`}
        >
          Decline
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => run(() => sendRequestAction(userId), "outgoing", "Friend request sent")}
      className={`${baseBtn} bg-brand-600 hover:bg-brand-700 text-white`}
    >
      Add friend
    </button>
  );
}

export function IncomingRequestActions({ requesterId }: { requesterId: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState<string | null>(null);

  const run = (
    fn: () => Promise<{ ok: boolean; message?: string }>,
    label: string,
    msg: string,
  ) => {
    startTransition(async () => {
      const res = await fn();
      if (res.ok) {
        setDone(label);
        showToast(msg, "success");
        router.refresh();
      } else {
        showToast(res.message ?? "Something went wrong", "error");
      }
    });
  };

  if (done) {
    return (
      <span className="text-sm text-slate-500 dark:text-slate-400 px-2">
        {done}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          run(() => acceptRequestAction(requesterId), "Accepted", "You're now friends")
        }
        className={`${baseBtn} bg-brand-600 hover:bg-brand-700 text-white`}
      >
        Accept
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          run(() => removeFriendAction(requesterId), "Declined", "Request declined")
        }
        className={`${baseBtn} border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400`}
      >
        Decline
      </button>
    </div>
  );
}

export function RemoveFriendButton({ userId }: { userId: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [removed, setRemoved] = useState(false);

  if (removed) {
    return (
      <span className="text-sm text-slate-400 dark:text-slate-500 px-2">
        Removed
      </span>
    );
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-sm text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-150"
      >
        Remove
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const res = await removeFriendAction(userId);
            if (res.ok) {
              setRemoved(true);
              showToast("Friend removed", "success");
              router.refresh();
            } else {
              showToast(res.message ?? "Something went wrong", "error");
            }
          })
        }
        className="text-sm text-red-600 dark:text-red-400 font-medium hover:underline disabled:opacity-60"
      >
        Confirm
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-sm text-slate-500 dark:text-slate-400 hover:underline"
      >
        Cancel
      </button>
    </div>
  );
}
