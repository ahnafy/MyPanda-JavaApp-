package anywheresoftware.b4a.objects;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.Service;
import anywheresoftware.b4a.BA;
import anywheresoftware.b4a.BA.ActivityObject;
import anywheresoftware.b4a.BA.Hide;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

@ActivityObject
public class ServiceHelper {
    private static Method mStartForeground;
    private static final Class<?>[] mStartForegroundSignature = new Class[]{Integer.TYPE, Notification.class};
    private static Method mStopForeground;
    private static final Class<?>[] mStopForegroundSignature = new Class[]{Boolean.TYPE};
    NotificationManager mNM = ((NotificationManager) BA.applicationContext.getSystemService("notification"));
    private Service service;

    @Hide
    public static void init() {
        try {
            mStartForeground = Service.class.getMethod("startForeground", mStartForegroundSignature);
            mStopForeground = Service.class.getMethod("stopForeground", mStopForegroundSignature);
        } catch (NoSuchMethodException e) {
            mStopForeground = null;
            mStartForeground = null;
        }
    }

    public ServiceHelper(Service service) {
        this.service = service;
    }

    public void StartForeground(int Id, Notification Notification) throws IllegalArgumentException, IllegalAccessException, InvocationTargetException {
        if (mStartForeground != null) {
            mStartForeground.invoke(this.service, new Object[]{Integer.valueOf(Id), Notification});
            return;
        }
        this.service.setForeground(true);
        this.mNM.notify(Id, Notification);
    }

    public void StopForeground(int Id) throws IllegalArgumentException, IllegalAccessException, InvocationTargetException {
        if (mStopForeground != null) {
            mStopForeground.invoke(this.service, new Object[]{Boolean.TRUE});
            return;
        }
        this.mNM.cancel(Id);
        this.service.setForeground(false);
    }
}
