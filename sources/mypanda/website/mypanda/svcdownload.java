package mypanda.website.mypanda;

import android.app.Notification;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.IBinder;
import anywheresoftware.b4a.BA;
import anywheresoftware.b4a.http.HttpClientWrapper;
import anywheresoftware.b4a.http.HttpClientWrapper.HttpResponeWrapper;
import anywheresoftware.b4a.http.HttpClientWrapper.HttpUriRequestWrapper;
import anywheresoftware.b4a.keywords.Common;
import anywheresoftware.b4a.objects.IntentWrapper;
import anywheresoftware.b4a.objects.NotificationWrapper;
import anywheresoftware.b4a.objects.ServiceHelper;
import anywheresoftware.b4a.objects.streams.File;
import anywheresoftware.b4a.objects.streams.File.OutputStreamWrapper;
import java.io.OutputStream;
import java.lang.reflect.Method;

public class svcdownload extends Service {
    public static boolean _donesuccessfully = false;
    public static HttpClientWrapper _hc = null;
    public static int _jobstatus = 0;
    public static int _status_done = 0;
    public static int _status_none = 0;
    public static int _status_working = 0;
    public static OutputStreamWrapper _target = null;
    public static int _task = 0;
    public static String _url = "";
    static svcdownload mostCurrent;
    public static BA processBA;
    public Common __c = null;
    public main _main = null;
    private ServiceHelper _service;

    public static class svcdownload_BR extends BroadcastReceiver {
        public void onReceive(Context context, Intent intent) {
            Intent intent2 = new Intent(context, svcdownload.class);
            if (intent != null) {
                intent2.putExtra("b4a_internal_intent", intent);
            }
            context.startService(intent2);
        }
    }

    public static Class<?> getObject() {
        return svcdownload.class;
    }

    public void onCreate() {
        mostCurrent = this;
        if (processBA == null) {
            processBA = new BA(this, null, null, "avalle.net.web2apk", "avalle.net.web2apk.svcdownload");
            try {
                Class.forName(BA.applicationContext.getPackageName() + ".main").getMethod("initializeProcessGlobals", new Class[0]).invoke(null, null);
                processBA.loadHtSubs(getClass());
                ServiceHelper.init();
            } catch (Throwable e) {
                throw new RuntimeException(e);
            }
        }
        this._service = new ServiceHelper(this);
        processBA.service = this;
        processBA.setActivityPaused(false);
        if (BA.isShellModeRuntimeCheck(processBA)) {
            boolean z = true;
            processBA.raiseEvent2(null, z, "CREATE", true, "avalle.net.web2apk.svcdownload", processBA, this._service);
        }
        BA.LogInfo("** Service (svcdownload) Create **");
        processBA.raiseEvent(null, "service_create", new Object[0]);
    }

    public void onStart(Intent intent, int i) {
        handleStart(intent);
    }

    public int onStartCommand(Intent intent, int i, int i2) {
        handleStart(intent);
        return 2;
    }

    private void handleStart(Intent intent) {
        BA.LogInfo("** Service (svcdownload) Start **");
        Method method = (Method) processBA.htSubs.get("service_start");
        if (method == null) {
            return;
        }
        if (method.getParameterTypes().length > 0) {
            IntentWrapper intentWrapper = new IntentWrapper();
            if (intent != null) {
                if (intent.hasExtra("b4a_internal_intent")) {
                    intentWrapper.setObject((Intent) intent.getParcelableExtra("b4a_internal_intent"));
                } else {
                    intentWrapper.setObject(intent);
                }
            }
            processBA.raiseEvent(null, "service_start", intentWrapper);
            return;
        }
        processBA.raiseEvent(null, "service_start", new Object[0]);
    }

    public IBinder onBind(Intent intent) {
        return null;
    }

    public void onDestroy() {
        BA.LogInfo("** Service (svcdownload) Destroy **");
        processBA.raiseEvent(null, "service_destroy", new Object[0]);
        processBA.service = null;
        mostCurrent = null;
        processBA.setActivityPaused(true);
    }

    public static String _finish(int i) throws Exception {
        Common.Log("Service finished downloading");
        _jobstatus = _status_done;
        NotificationWrapper notificationWrapper = new NotificationWrapper();
        notificationWrapper.Initialize();
        notificationWrapper.setIcon("icon");
        notificationWrapper.setVibrate(false);
        notificationWrapper.setSound(true);
        main main;
        if (_donesuccessfully) {
            StringBuilder append = new StringBuilder().append("File saved in ");
            File file = Common.File;
            String stringBuilder = append.append(File.getDirRootExternal()).toString();
            main = mostCurrent._main;
            notificationWrapper.SetInfo(processBA, "Download Finished", stringBuilder, main.getObject());
        } else {
            main = mostCurrent._main;
            notificationWrapper.SetInfo(processBA, "Download", "Cancelled or Interrupted", main.getObject());
        }
        notificationWrapper.setAutoCancel(true);
        notificationWrapper.Notify(i);
        return "";
    }

    public static String _hc_responseerror(String str, int i, int i2) throws Exception {
        Common.ToastMessageShow("Error downloading file: " + str, true);
        _donesuccessfully = false;
        _finish(i2);
        return "";
    }

    public static String _hc_responsesuccess(HttpResponeWrapper httpResponeWrapper, int i) throws Exception {
        httpResponeWrapper.GetAsynchronously(processBA, "Response", (OutputStream) _target.getObject(), true, i);
        return "";
    }

    public static String _process_globals() throws Exception {
        _hc = new HttpClientWrapper();
        _url = "";
        _target = new OutputStreamWrapper();
        _task = 0;
        _jobstatus = 0;
        _status_none = 0;
        _status_working = 0;
        _status_done = 0;
        _status_none = 0;
        _status_working = 1;
        _status_done = 2;
        _donesuccessfully = false;
        return "";
    }

    public static String _response_streamfinish(boolean z, int i) throws Exception {
        if (z) {
            Common.ToastMessageShow("Download Finished.", true);
        } else {
            Common.ToastMessageShow("Error downloading file: " + Common.LastException(processBA).getMessage(), true);
        }
        _donesuccessfully = z;
        _finish(i);
        return "";
    }

    public static String _service_create() throws Exception {
        String str = "";
        _hc.Initialize("HC");
        BA.NumberToString(1);
        return "";
    }

    public static String _service_destroy() throws Exception {
        return "";
    }

    public static String _service_start(IntentWrapper intentWrapper) throws Exception {
        HttpUriRequestWrapper httpUriRequestWrapper = new HttpUriRequestWrapper();
        httpUriRequestWrapper.InitializeGet(_url);
        _hc.Execute(processBA, httpUriRequestWrapper, _task);
        NotificationWrapper notificationWrapper = new NotificationWrapper();
        notificationWrapper.Initialize();
        notificationWrapper.setIcon("icon");
        notificationWrapper.setVibrate(false);
        String str = "File: " + _url;
        main main = mostCurrent._main;
        notificationWrapper.SetInfo(processBA, "Downloading", str, main.getObject());
        notificationWrapper.setSound(false);
        notificationWrapper.Notify(_task);
        mostCurrent._service.StartForeground(_task, (Notification) notificationWrapper.getObject());
        _task++;
        return "";
    }
}
