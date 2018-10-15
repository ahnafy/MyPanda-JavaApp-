package anywheresoftware.b4a;

import android.app.AlertDialog;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.DialogInterface.OnClickListener;
import android.graphics.drawable.Drawable;
import android.os.Build.VERSION;
import android.os.Looper;
import android.os.Message;
import android.os.MessageQueue;
import android.util.Log;
import anywheresoftware.b4a.BA.B4ARunnable;
import anywheresoftware.b4a.BA.Hide;
import java.lang.ref.WeakReference;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

@Hide
public class Msgbox {
    private static Object closeMyLoop = new Object();
    private static Field flagsF;
    public static boolean isDismissing = false;
    private static Method nextM;
    public static WeakReference<ProgressDialog> pd;
    private static final boolean shouldRecycle;
    private static boolean stopCodeAfterDismiss = false;
    private static boolean visible = false;
    private static WeakReference<AlertDialog> visibleAD;
    private static Field whenF;

    public static class DialogResponse implements OnClickListener {
        private boolean dismiss;
        public int res = -3;

        public DialogResponse(boolean dismissAfterClick) {
            this.dismiss = dismissAfterClick;
        }

        public void onClick(DialogInterface dialog, int which) {
            this.res = which;
            if (this.dismiss) {
                ((AlertDialog) Msgbox.visibleAD.get()).dismiss();
            }
        }
    }

    static {
        boolean z = true;
        if (VERSION.SDK_INT >= 20) {
            z = false;
        }
        shouldRecycle = z;
        try {
            nextM = MessageQueue.class.getDeclaredMethod("next", null);
            nextM.setAccessible(true);
            whenF = Message.class.getDeclaredField("when");
            whenF.setAccessible(true);
            flagsF = null;
            try {
                flagsF = Message.class.getDeclaredField("flags");
                flagsF.setAccessible(true);
            } catch (Exception e) {
            }
        } catch (Exception e2) {
            e2.printStackTrace();
        }
    }

    public static boolean msgboxIsVisible() {
        return visible;
    }

    public static boolean isItReallyAMsgboxAndNotDebug() {
        return visibleAD != null;
    }

    public static void dismiss(boolean stopCodeAfterDismiss) {
        dismissProgressDialog();
        if (BA.debugMode) {
            try {
                Class.forName("anywheresoftware.b4a.debug.Debug").getMethod("hideProgressDialogToAvoidLeak", null).invoke(null, null);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        isDismissing = true;
        if (visible) {
            if (visibleAD != null) {
                AlertDialog ad = (AlertDialog) visibleAD.get();
                if (ad != null) {
                    ad.dismiss();
                }
            } else {
                sendCloseMyLoopMessage();
            }
            stopCodeAfterDismiss = stopCodeAfterDismiss;
        }
    }

    public static void sendCloseMyLoopMessage() {
        Message msg = Message.obtain();
        msg.setTarget(BA.handler);
        msg.obj = closeMyLoop;
        msg.sendToTarget();
    }

    public static void dismissProgressDialog() {
        if (pd != null) {
            ProgressDialog p = (ProgressDialog) pd.get();
            if (p != null) {
                p.dismiss();
            }
        }
    }

    public static void msgbox(AlertDialog ad, boolean isTopMostInStack) {
        if (!visible) {
            try {
                if (!isDismissing) {
                    stopCodeAfterDismiss = false;
                    Message msg = Message.obtain();
                    msg.setTarget(BA.handler);
                    msg.obj = closeMyLoop;
                    ad.setDismissMessage(msg);
                    visible = true;
                    visibleAD = new WeakReference(ad);
                    ad.show();
                    waitForMessage(false);
                    if (!stopCodeAfterDismiss || isTopMostInStack) {
                        visible = false;
                        visibleAD = null;
                        return;
                    }
                    throw new B4AUncaughtException();
                }
            } finally {
                visible = false;
                visibleAD = null;
            }
        }
    }

    public static void debugWait(Dialog d) {
        if (visible) {
            System.out.println("already visible");
            return;
        }
        try {
            if (!isDismissing) {
                stopCodeAfterDismiss = false;
                visible = true;
                waitForMessage(true);
                if (stopCodeAfterDismiss) {
                    Log.w("", "throwing b4a uncaught exception");
                    throw new B4AUncaughtException();
                } else {
                    visible = false;
                }
            }
        } finally {
            visible = false;
        }
    }

    public static void waitForMessage(boolean notUsed, boolean onlyDrawableEvents) {
        waitForMessage(onlyDrawableEvents);
    }

    private static void waitForMessage(boolean onlyDrawableEvents) {
        try {
            Message msg;
            MessageQueue queue = Looper.myQueue();
            while (true) {
                msg = (Message) nextM.invoke(queue, null);
                if (msg != null) {
                    if (msg.obj == closeMyLoop) {
                        break;
                    } else if (msg.getCallback() == null || !(msg.getCallback() instanceof B4ARunnable)) {
                        if (onlyDrawableEvents) {
                            if ((msg.obj == null || !(msg.obj instanceof Drawable)) && msg.what >= 100 && msg.what <= 150) {
                                skipMessage(msg);
                            }
                        }
                        msg.getTarget().dispatchMessage(msg);
                        if (shouldRecycle) {
                            msg.recycle();
                        }
                    } else {
                        skipMessage(msg);
                    }
                }
            }
            if (shouldRecycle) {
                msg.recycle();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void skipMessage(Message msg) throws IllegalArgumentException, IllegalAccessException {
        whenF.set(msg, Integer.valueOf(0));
        if (flagsF != null) {
            flagsF.setInt(msg, flagsF.getInt(msg) & -2);
        }
        msg.getTarget().sendMessage(msg);
    }
}
