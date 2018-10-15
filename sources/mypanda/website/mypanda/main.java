package mypanda.website.mypanda;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Build.VERSION;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MenuItem.OnMenuItemClickListener;
import anywheresoftware.b4a.B4AActivity;
import anywheresoftware.b4a.B4AMenuItem;
import anywheresoftware.b4a.BA;
import anywheresoftware.b4a.BALayout;
import anywheresoftware.b4a.Msgbox;
import anywheresoftware.b4a.keywords.Common;
import anywheresoftware.b4a.keywords.StringBuilderWrapper;
import anywheresoftware.b4a.keywords.constants.DialogResponse;
import anywheresoftware.b4a.keywords.constants.KeyCodes;
import anywheresoftware.b4a.objects.ActivityWrapper;
import anywheresoftware.b4a.objects.IntentWrapper;
import anywheresoftware.b4a.objects.SaxParser;
import anywheresoftware.b4a.objects.SaxParser.AttributesWrapper;
import anywheresoftware.b4a.objects.SocketWrapper.ServerSocketWrapper;
import anywheresoftware.b4a.objects.ViewWrapper;
import anywheresoftware.b4a.objects.WebViewWrapper;
import anywheresoftware.b4a.objects.streams.File;
import anywheresoftware.b4a.objects.streams.File.InputStreamWrapper;
import anywheresoftware.b4a.phone.Phone;
import java.io.InputStream;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.Iterator;

public class main extends Activity implements B4AActivity {
    public static String _apptitle = "";
    public static String _laurl = "";
    public static ServerSocketWrapper _mylan = null;
    public static SaxParser _parser = null;
    public static String _posicion = "";
    public static boolean _tranca = false;
    public static String _txfiltro = "";
    public static String _txfiltrourl = "";
    public static String _txinicio = "";
    public static String _txiniciotitulo = "";
    public static String _txnored = "";
    public static String _txnoredretry = "";
    public static String _txnoredsalir = "";
    public static String _txnoredtitulo = "";
    public static String _txquieresalir = "";
    public static String _txquieresalirno = "";
    public static String _txquieresalirsi = "";
    public static String _txquieresalirtitulo = "";
    static boolean afterFirstLayout = false;
    public static final boolean fullScreen = true;
    public static final boolean includeTitle = false;
    static boolean isFirst = true;
    public static main mostCurrent;
    public static WeakReference<Activity> previousOne;
    public static BA processBA;
    private static boolean processGlobalsRun = false;
    public Common __c = null;
    ActivityWrapper _activity;
    public Phone _phn = null;
    public svcdownload _svcdownload = null;
    public WebViewWrapper _web = null;
    BA activityBA;
    BALayout layout;
    ArrayList<B4AMenuItem> menuItems;
    private Boolean onKeySubExist = null;
    private Boolean onKeyUpSubExist = null;

    private class B4AMenuItemsClickListener implements OnMenuItemClickListener {
        private final String eventName;

        public B4AMenuItemsClickListener(String str) {
            this.eventName = str;
        }

        public boolean onMenuItemClick(MenuItem menuItem) {
            main.processBA.raiseEvent(menuItem.getTitle(), this.eventName + "_click", new Object[0]);
            return true;
        }
    }

    private class HandleKeyDelayed implements Runnable {
        int kc;

        private HandleKeyDelayed() {
        }

        public void run() {
            runDirectly(this.kc);
        }

        public boolean runDirectly(int i) {
            Boolean bool = (Boolean) main.processBA.raiseEvent2(main.this._activity, false, "activity_keypress", false, Integer.valueOf(i));
            if (bool == null || bool.booleanValue()) {
                return true;
            }
            if (i != 4) {
                return false;
            }
            main.this.finish();
            return true;
        }
    }

    private static class ResumeMessage implements Runnable {
        private final WeakReference<Activity> activity;

        public ResumeMessage(Activity activity) {
            this.activity = new WeakReference(activity);
        }

        public void run() {
            if (main.mostCurrent != null && main.mostCurrent == this.activity.get()) {
                main.processBA.setActivityPaused(false);
                BA.LogInfo("** Activity (main) Resume **");
                main.processBA.raiseEvent(main.mostCurrent._activity, "activity_resume", (Object[]) null);
            }
        }
    }

    private static class WaitForLayout implements Runnable {
        private WaitForLayout() {
        }

        public void run() {
            if (!main.afterFirstLayout && main.mostCurrent != null) {
                if (main.mostCurrent.layout.getWidth() == 0) {
                    BA.handler.postDelayed(this, 5);
                    return;
                }
                main.mostCurrent.layout.getLayoutParams().height = main.mostCurrent.layout.getHeight();
                main.mostCurrent.layout.getLayoutParams().width = main.mostCurrent.layout.getWidth();
                main.afterFirstLayout = true;
                main.mostCurrent.afterFirstLayout();
            }
        }
    }

    public void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        if (isFirst) {
            processBA = new BA(getApplicationContext(), null, null, "avalle.net.web2apk", "avalle.net.web2apk.main");
            processBA.loadHtSubs(getClass());
            BALayout.setDeviceScale(getApplicationContext().getResources().getDisplayMetrics().density);
        } else if (previousOne != null) {
            Activity activity = (Activity) previousOne.get();
            if (!(activity == null || activity == this)) {
                BA.LogInfo("Killing previous instance (main).");
                activity.finish();
            }
        }
        getWindow().requestFeature(1);
        getWindow().setFlags(1024, 1024);
        mostCurrent = this;
        processBA.sharedProcessBA.activityBA = null;
        this.layout = new BALayout(this);
        setContentView(this.layout);
        afterFirstLayout = false;
        BA.handler.postDelayed(new WaitForLayout(), 5);
    }

    private void afterFirstLayout() {
        if (this == mostCurrent) {
            Object obj;
            boolean z;
            this.activityBA = new BA(this, this.layout, processBA, "avalle.net.web2apk", "avalle.net.web2apk.main");
            processBA.sharedProcessBA.activityBA = new WeakReference(this.activityBA);
            ViewWrapper.lastId = 0;
            this._activity = new ActivityWrapper(this.activityBA, "activity");
            Msgbox.isDismissing = false;
            if (BA.isShellModeRuntimeCheck(processBA)) {
                if (isFirst) {
                    processBA.raiseEvent2(null, true, "SHELL", false, new Object[0]);
                }
                obj = null;
                z = true;
                processBA.raiseEvent2(obj, z, "CREATE", true, "avalle.net.web2apk.main", processBA, this.activityBA, this._activity, Float.valueOf(Common.Density), mostCurrent);
                this._activity.reinitializeForShell(this.activityBA, "activity");
            }
            initializeProcessGlobals();
            initializeGlobals();
            BA.LogInfo("** Activity (main) Create, isFirst = " + isFirst + " **");
            obj = null;
            z = true;
            processBA.raiseEvent2(obj, z, "activity_create", false, Boolean.valueOf(isFirst));
            isFirst = false;
            if (this == mostCurrent) {
                processBA.setActivityPaused(false);
                BA.LogInfo("** Activity (main) Resume **");
                processBA.raiseEvent(null, "activity_resume", new Object[0]);
                if (VERSION.SDK_INT >= 11) {
                    try {
                        Activity.class.getMethod("invalidateOptionsMenu", new Class[0]).invoke(this, (Object[]) null);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    public void addMenuItem(B4AMenuItem b4AMenuItem) {
        if (this.menuItems == null) {
            this.menuItems = new ArrayList();
        }
        this.menuItems.add(b4AMenuItem);
    }

    public boolean onCreateOptionsMenu(Menu menu) {
        super.onCreateOptionsMenu(menu);
        if (this.menuItems == null) {
            return false;
        }
        Iterator it = this.menuItems.iterator();
        while (it.hasNext()) {
            B4AMenuItem b4AMenuItem = (B4AMenuItem) it.next();
            MenuItem add = menu.add(b4AMenuItem.title);
            if (b4AMenuItem.drawable != null) {
                add.setIcon(b4AMenuItem.drawable);
            }
            if (VERSION.SDK_INT >= 11) {
                try {
                    if (b4AMenuItem.addToBar) {
                        MenuItem.class.getMethod("setShowAsAction", new Class[]{Integer.TYPE}).invoke(add, new Object[]{Integer.valueOf(1)});
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            add.setOnMenuItemClickListener(new B4AMenuItemsClickListener(b4AMenuItem.eventName.toLowerCase(BA.cul)));
        }
        return true;
    }

    public void onWindowFocusChanged(boolean z) {
        super.onWindowFocusChanged(z);
        if (processBA.subExists("activity_windowfocuschanged")) {
            processBA.raiseEvent2(null, true, "activity_windowfocuschanged", false, Boolean.valueOf(z));
        }
    }

    public static Class<?> getObject() {
        return main.class;
    }

    public boolean onKeyDown(int i, KeyEvent keyEvent) {
        if (this.onKeySubExist == null) {
            this.onKeySubExist = Boolean.valueOf(processBA.subExists("activity_keypress"));
        }
        if (this.onKeySubExist.booleanValue()) {
            if (i == 4 && VERSION.SDK_INT >= 18) {
                Runnable handleKeyDelayed = new HandleKeyDelayed();
                handleKeyDelayed.kc = i;
                BA.handler.post(handleKeyDelayed);
                return true;
            } else if (new HandleKeyDelayed().runDirectly(i)) {
                return true;
            }
        }
        return super.onKeyDown(i, keyEvent);
    }

    public boolean onKeyUp(int i, KeyEvent keyEvent) {
        if (this.onKeyUpSubExist == null) {
            this.onKeyUpSubExist = Boolean.valueOf(processBA.subExists("activity_keyup"));
        }
        if (this.onKeyUpSubExist.booleanValue()) {
            Boolean bool = (Boolean) processBA.raiseEvent2(this._activity, false, "activity_keyup", false, Integer.valueOf(i));
            if (bool == null || bool.booleanValue()) {
                return true;
            }
        }
        return super.onKeyUp(i, keyEvent);
    }

    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
    }

    public void onPause() {
        super.onPause();
        if (this._activity != null) {
            Msgbox.dismiss(true);
            BA.LogInfo("** Activity (main) Pause, UserClosed = " + this.activityBA.activity.isFinishing() + " **");
            processBA.raiseEvent2(this._activity, true, "activity_pause", false, Boolean.valueOf(this.activityBA.activity.isFinishing()));
            processBA.setActivityPaused(true);
            mostCurrent = null;
            if (!this.activityBA.activity.isFinishing()) {
                previousOne = new WeakReference(this);
            }
            Msgbox.isDismissing = false;
        }
    }

    public void onDestroy() {
        super.onDestroy();
        previousOne = null;
    }

    public void onResume() {
        super.onResume();
        mostCurrent = this;
        Msgbox.isDismissing = false;
        if (this.activityBA != null) {
            BA.handler.post(new ResumeMessage(mostCurrent));
        }
    }

    protected void onActivityResult(int i, int i2, Intent intent) {
        processBA.onActivityResult(i, i2, intent);
    }

    private static void initializeGlobals() {
        processBA.raiseEvent2(null, true, "globals", false, (Object[]) null);
    }

    public static boolean isAnyActivityVisible() {
        int i;
        if (mostCurrent != null) {
            i = 1;
        } else {
            i = 0;
        }
        return i | false;
    }

    public static String _acomodar() throws Exception {
        mostCurrent._web.setLeft(0);
        mostCurrent._web.setTop(0);
        mostCurrent._web.setHeight(mostCurrent._activity.getHeight());
        mostCurrent._web.setWidth(mostCurrent._activity.getWidth());
        mostCurrent._web.setZoomEnabled(false);
        mostCurrent._web.setVisible(true);
        return "";
    }

    public static String _activity_create(boolean z) throws Exception {
        mostCurrent._activity.LoadLayout("laweb", mostCurrent.activityBA);
        if (z) {
            _parser.Initialize(processBA);
        }
        _cargarvariables();
        _mylan.Initialize(processBA, 0, "");
        while (_mylan.GetMyIP().equals("127.0.0.1")) {
            int Msgbox2 = Common.Msgbox2(_txnored, _txnoredtitulo, _txnoredsalir, _txnoredretry, "", (Bitmap) Common.Null, mostCurrent.activityBA);
            DialogResponse dialogResponse = Common.DialogResponse;
            if (Msgbox2 == -1) {
                Common.ExitApplication();
            }
            _mylan.Initialize(processBA, 0, "");
        }
        mostCurrent._web.LoadUrl(_laurl);
        if (z) {
            Phone phone;
            if (_posicion.equals("ver")) {
                phone = mostCurrent._phn;
                Phone.SetScreenOrientation(processBA, 1);
            } else {
                phone = mostCurrent._phn;
                Phone.SetScreenOrientation(processBA, 0);
            }
        }
        Common.Msgbox(_txinicio, _txiniciotitulo, mostCurrent.activityBA);
        return "";
    }

    public static boolean _activity_keypress(int i) throws Exception {
        String str = "";
        KeyCodes keyCodes = Common.KeyCodes;
        if (i != 4) {
            return false;
        }
        str = "";
        mostCurrent._web.getUrl();
        if (mostCurrent._web.getUrl().equals(_laurl) || mostCurrent._web.getUrl().equals(_laurl + "/")) {
            int Msgbox2 = Common.Msgbox2(_txquieresalir, _txquieresalirtitulo, _txquieresalirsi, _txquieresalirno, "", (Bitmap) Common.Null, mostCurrent.activityBA);
            DialogResponse dialogResponse = Common.DialogResponse;
            if (Msgbox2 == -1) {
                return false;
            }
            return true;
        }
        mostCurrent._web.LoadUrl(_laurl);
        return true;
    }

    public static String _activity_pause(boolean z) throws Exception {
        if (z) {
            Common.ExitApplication();
        }
        return "";
    }

    public static String _activity_resume() throws Exception {
        _acomodar();
        return "";
    }

    public static String _cargarvariables() throws Exception {
        InputStreamWrapper inputStreamWrapper = new InputStreamWrapper();
        File file = Common.File;
        file = Common.File;
        InputStreamWrapper OpenInput = File.OpenInput(File.getDirAssets(), "config.xml");
        _parser.Parse((InputStream) OpenInput.getObject(), "Parser");
        OpenInput.Close();
        return "";
    }

    public static void initializeProcessGlobals() {
        if (!processGlobalsRun) {
            processGlobalsRun = true;
            try {
                _process_globals();
                svcdownload._process_globals();
            } catch (Throwable e) {
                throw new RuntimeException(e);
            }
        }
    }

    public static String _globals() throws Exception {
        mostCurrent._web = new WebViewWrapper();
        mostCurrent._phn = new Phone();
        return "";
    }

    public static String _parser_endelement(String str, String str2, StringBuilderWrapper stringBuilderWrapper) throws Exception {
        if (_parser.Parents.IndexOf("config") > -1) {
            switch (BA.switchObjectToInt(str2, "apptitle", "laurl", "txinicio", "txiniciotitulo", "txnored", "txnoredtitulo", "txnoredretry", "txnoredsalir", "txquieresalir", "txquieresalirtitulo", "txquieresalirsi", "txquieresalirno", "txfiltro", "txfiltrourl", "posicion")) {
                case 0:
                    _apptitle = stringBuilderWrapper.ToString().trim();
                    break;
                case 1:
                    _laurl = stringBuilderWrapper.ToString().trim();
                    break;
                case 2:
                    _txinicio = stringBuilderWrapper.ToString().trim();
                    break;
                case 3:
                    _txiniciotitulo = stringBuilderWrapper.ToString().trim();
                    break;
                case 4:
                    _txnored = stringBuilderWrapper.ToString().trim();
                    break;
                case 5:
                    _txnoredtitulo = stringBuilderWrapper.ToString().trim();
                    break;
                case 6:
                    _txnoredretry = stringBuilderWrapper.ToString().trim();
                    break;
                case 7:
                    _txnoredsalir = stringBuilderWrapper.ToString().trim();
                    break;
                case 8:
                    _txquieresalir = stringBuilderWrapper.ToString().trim();
                    break;
                case KeyCodes.KEYCODE_2 /*9*/:
                    _txquieresalirtitulo = stringBuilderWrapper.ToString().trim();
                    break;
                case KeyCodes.KEYCODE_3 /*10*/:
                    _txquieresalirsi = stringBuilderWrapper.ToString().trim();
                    break;
                case KeyCodes.KEYCODE_4 /*11*/:
                    _txquieresalirno = stringBuilderWrapper.ToString().trim();
                    break;
                case KeyCodes.KEYCODE_5 /*12*/:
                    _txfiltro = stringBuilderWrapper.ToString().trim();
                    break;
                case KeyCodes.KEYCODE_6 /*13*/:
                    _txfiltrourl = stringBuilderWrapper.ToString().trim();
                    break;
                case KeyCodes.KEYCODE_7 /*14*/:
                    _posicion = stringBuilderWrapper.ToString().trim();
                    break;
            }
        }
        return "";
    }

    public static String _parser_startelement(String str, String str2, AttributesWrapper attributesWrapper) throws Exception {
        return "";
    }

    public static String _process_globals() throws Exception {
        _laurl = "";
        _mylan = new ServerSocketWrapper();
        _parser = new SaxParser();
        _tranca = false;
        _apptitle = "";
        _txinicio = "";
        _txiniciotitulo = "";
        _txnored = "";
        _txnoredtitulo = "";
        _txnoredretry = "";
        _txnoredsalir = "";
        _txquieresalir = "";
        _txquieresalirtitulo = "";
        _txquieresalirsi = "";
        _txquieresalirno = "";
        _txfiltro = "";
        _txfiltrourl = "";
        _posicion = "";
        _tranca = true;
        return "";
    }

    public static boolean _web_overrideurl(String str) throws Exception {
        String str2 = "";
        str2 = "";
        str2 = "";
        str2 = "";
        str2 = "";
        String str3 = ".apk.jpg.pdf.mp3.zip.rar";
        int lastIndexOf = str.lastIndexOf(".");
        if (lastIndexOf != -1) {
            lastIndexOf = str3.indexOf(str.substring(lastIndexOf).toLowerCase());
        }
        IntentWrapper intentWrapper;
        if (str.startsWith("market://")) {
            try {
                intentWrapper = new IntentWrapper();
                intentWrapper.Initialize(IntentWrapper.ACTION_VIEW, str);
                Common.StartActivity(mostCurrent.activityBA, intentWrapper.getObject());
            } catch (Exception e) {
                processBA.setLastException(e);
                Common.Msgbox("You need to install Google Play Store on your device in order to follow this link.", "Missing Google Play Store", mostCurrent.activityBA);
            }
            return true;
        } else if (str.startsWith("fb://")) {
            try {
                intentWrapper = new IntentWrapper();
                intentWrapper.Initialize(IntentWrapper.ACTION_VIEW, str);
                Common.StartActivity(mostCurrent.activityBA, intentWrapper.getObject());
            } catch (Exception e2) {
                processBA.setLastException(e2);
                Common.Msgbox("You need to install Facebook App in order to use Facebook in your Android device.", "Missing Facebook App", mostCurrent.activityBA);
            }
            return true;
        } else if (lastIndexOf != -1) {
            str2 = "";
            String str4 = "";
            str4 = "";
            str3 = "|\\\\?*<\\:>+[]/'=" + BA.ObjectToString(Character.valueOf(Common.Chr(34)));
            for (int length = str.length() - 1; length >= 0; length = (length + 0) - 1) {
                String ObjectToString = BA.ObjectToString(Character.valueOf(str.charAt(length)));
                if (str3.indexOf(ObjectToString) != -1) {
                    break;
                }
                str2 = ObjectToString + str2;
            }
            svcdownload svcdownload = mostCurrent._svcdownload;
            svcdownload._url = str;
            svcdownload = mostCurrent._svcdownload;
            File file = Common.File;
            file = Common.File;
            svcdownload._target = File.OpenOutput(File.getDirRootExternal(), str2, false);
            BA ba = mostCurrent.activityBA;
            svcdownload = mostCurrent._svcdownload;
            Common.StartService(ba, svcdownload.getObject());
            return false;
        } else if (!_txfiltro.equals("si")) {
            return false;
        } else {
            if (str.startsWith(_laurl)) {
                _tranca = true;
                return false;
            }
            if (str.indexOf(_txfiltrourl) != -1) {
                _tranca = false;
            }
            return _tranca;
        }
    }
}
