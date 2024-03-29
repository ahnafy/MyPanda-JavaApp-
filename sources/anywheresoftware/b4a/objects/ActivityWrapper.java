package anywheresoftware.b4a.objects;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnTouchListener;
import android.view.ViewGroup;
import anywheresoftware.b4a.AbsObjectWrapper;
import anywheresoftware.b4a.B4AActivity;
import anywheresoftware.b4a.B4AMenuItem;
import anywheresoftware.b4a.BA;
import anywheresoftware.b4a.BA.ActivityObject;
import anywheresoftware.b4a.BA.Hide;
import anywheresoftware.b4a.BA.IterableList;
import anywheresoftware.b4a.BA.Pixel;
import anywheresoftware.b4a.BA.RaisesSynchronousEvents;
import anywheresoftware.b4a.BA.ShortName;
import anywheresoftware.b4a.BALayout;
import anywheresoftware.b4a.BALayout.LayoutParams;
import anywheresoftware.b4a.DynamicBuilder;
import anywheresoftware.b4a.keywords.LayoutBuilder;
import anywheresoftware.b4a.keywords.LayoutBuilder.LayoutHashMap;
import anywheresoftware.b4a.keywords.LayoutBuilder.ViewWrapperAndAnchor;
import anywheresoftware.b4a.keywords.LayoutValues;
import anywheresoftware.b4a.objects.drawable.BitmapDrawable;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;

@ActivityObject
@ShortName("Activity")
public class ActivityWrapper extends ViewWrapper<BALayout> implements IterableList {
    public static final int ACTION_DOWN = 0;
    public static final int ACTION_MOVE = 2;
    public static final int ACTION_UP = 1;

    @Hide
    public static class AllViewsIterator implements IterableList {
        private ArrayList<View> views = new ArrayList();

        public AllViewsIterator(ViewGroup parent) {
            addViews(parent);
        }

        private void addViews(ViewGroup parent) {
            for (int i = 0; i < parent.getChildCount(); i++) {
                View v = parent.getChildAt(i);
                this.views.add(v);
                if (v instanceof ViewGroup) {
                    addViews((ViewGroup) v);
                }
            }
        }

        public Object Get(int index) {
            return this.views.get(index);
        }

        public int getSize() {
            return this.views.size();
        }
    }

    public ActivityWrapper(BA ba, String name) {
        if (!BA.shellMode) {
            reinitializeForShell(ba, name);
        }
    }

    @Hide
    public void reinitializeForShell(final BA ba, String name) {
        if (!IsInitialized()) {
            setObject(ba.vg);
            innerInitialize(ba, name, true);
            if (ba.subExists("activity_touch")) {
                ((BALayout) getObject()).setOnTouchListener(new OnTouchListener() {
                    public boolean onTouch(View v, MotionEvent event) {
                        ba.raiseEventFromUI(ActivityWrapper.this, "activity_touch", Integer.valueOf(event.getAction()), Float.valueOf(event.getX()), Float.valueOf(event.getY()));
                        return true;
                    }
                });
            }
        }
    }

    public IntentWrapper GetStartingIntent() {
        IntentWrapper iw = new IntentWrapper();
        iw.setObject(this.ba.activity.getIntent());
        return iw;
    }

    public void SetActivityResult(int Result, IntentWrapper Data) {
        this.ba.activity.setResult(Result, (Intent) Data.getObject());
    }

    public void AddView(View View, @Pixel int Left, @Pixel int Top, @Pixel int Width, @Pixel int Height) {
        ((BALayout) getObject()).addView(View, new LayoutParams(Left, Top, Width, Height));
    }

    public ConcreteViewWrapper GetView(int Index) {
        ConcreteViewWrapper vw = new ConcreteViewWrapper();
        vw.setObject(((BALayout) getObject()).getChildAt(Index));
        return vw;
    }

    public void RemoveAllViews() {
        ((BALayout) getObject()).removeAllViews();
    }

    public void RemoveViewAt(int Index) {
        ((BALayout) getObject()).removeViewAt(Index);
    }

    public int getNumberOfViews() {
        return ((BALayout) getObject()).getChildCount();
    }

    public void AddMenuItem(String Title, String EventName) {
        AddMenuItem3(Title, EventName, null, false);
    }

    public void AddMenuItem2(String Title, String EventName, Bitmap Bitmap) {
        AddMenuItem3(Title, EventName, Bitmap, false);
    }

    public void AddMenuItem3(String Title, String EventName, Bitmap Bitmap, boolean AddToActionBar) {
        Drawable d = null;
        if (Bitmap != null) {
            BitmapDrawable bd = new BitmapDrawable();
            bd.Initialize(Bitmap);
            d = (Drawable) bd.getObject();
        }
        ((B4AActivity) this.ba.activity).addMenuItem(new B4AMenuItem(Title, d, EventName, AddToActionBar));
    }

    @RaisesSynchronousEvents
    public LayoutValues LoadLayout(String LayoutFile, BA ba) throws Exception {
        AbsObjectWrapper.Activity_LoadLayout_Was_Called = true;
        return LayoutBuilder.loadLayout(LayoutFile, ba, true, ba.vg, null, false).layoutValues;
    }

    public void RerunDesignerScript(String Layout, BA ba, int Width, int Height) throws Exception {
        ViewGroup vg = new BALayout(ba.context);
        vg.setLayoutParams(new ViewGroup.LayoutParams(Width, Height));
        LinkedHashMap<String, ViewWrapperAndAnchor> dynamicTable = new LayoutHashMap();
        for (Field f : ba.activity.getClass().getFields()) {
            if (f.getName().startsWith("_") && ViewWrapper.class.isAssignableFrom(f.getType())) {
                dynamicTable.put(f.getName().substring(1), new ViewWrapperAndAnchor((ViewWrapper) f.get(ba.activity), null));
            }
        }
        LayoutBuilder.loadLayout(Layout, ba, false, vg, dynamicTable, false);
    }

    public void OpenMenu() {
        this.ba.activity.openOptionsMenu();
    }

    public void CloseMenu() {
        this.ba.activity.closeOptionsMenu();
    }

    public void setTitle(Object Title) {
        CharSequence cs;
        if (Title instanceof CharSequence) {
            cs = (CharSequence) Title;
        } else {
            cs = Title.toString();
        }
        this.ba.activity.setTitle(cs);
    }

    public CharSequence getTitle() {
        return this.ba.activity.getTitle();
    }

    public int getTitleColor() {
        return this.ba.activity.getTitleColor();
    }

    public void setTitleColor(int Color) {
        this.ba.activity.setTitleColor(Color);
    }

    public int getWidth() {
        return ((BALayout) getObject()).getWidth();
    }

    public int getHeight() {
        return ((BALayout) getObject()).getHeight();
    }

    public int getLeft() {
        return 0;
    }

    public int getTop() {
        return 0;
    }

    @Hide
    public void setVisible(boolean Visible) {
    }

    @Hide
    public boolean getVisible() {
        return true;
    }

    @Hide
    public void setEnabled(boolean Enabled) {
    }

    @Hide
    public boolean getEnabled() {
        return true;
    }

    @Hide
    public void BringToFront() {
    }

    @Hide
    public void SendToBack() {
    }

    @Hide
    public void RemoveView() {
    }

    public void Finish() {
        this.ba.activity.finish();
    }

    public IterableList GetAllViewsRecursive() {
        return new AllViewsIterator((ViewGroup) getObject());
    }

    @Hide
    public Object Get(int index) {
        return GetView(index).getObject();
    }

    @Hide
    public int getSize() {
        return getNumberOfViews();
    }

    @Hide
    public static View build(Object prev, HashMap<String, Object> props, boolean designer, Object tag) throws Exception {
        Drawable d = (Drawable) DynamicBuilder.build(prev, (HashMap) props.get("drawable"), designer, null);
        View v = (View) prev;
        int defaultTitleColor = 0;
        if (designer) {
            defaultTitleColor = ((Integer) ViewWrapper.getDefault(v, "titleColor", Integer.valueOf(((Activity) v.getContext()).getTitleColor()))).intValue();
        }
        if (d != null) {
            v.setBackgroundDrawable(d);
        }
        ((Activity) v.getContext()).setTitle((String) props.get("title"));
        int titleColor = ((Integer) props.get("titleColor")).intValue();
        if (titleColor != ViewWrapper.defaultColor) {
            ((Activity) v.getContext()).setTitleColor(titleColor);
        } else if (designer) {
            ((Activity) v.getContext()).setTitleColor(defaultTitleColor);
        }
        if (BA.debugMode) {
            BA.warningEngine.checkFullScreenInLayout(((Boolean) props.get("fullScreen")).booleanValue(), ((Boolean) props.get("includeTitle")).booleanValue());
        }
        if (designer) {
            boolean fullScreen = ((Boolean) props.get("fullScreen")).booleanValue();
            boolean includeTitle = ((Boolean) props.get("includeTitle")).booleanValue();
            Class<?> cls = Class.forName("anywheresoftware.b4a.designer.Designer");
            boolean prevFullScreen = cls.getField("fullScreen").getBoolean(v.getContext());
            boolean prevIncludeTitle = cls.getField("includeTitle").getBoolean(v.getContext());
            if (!(prevFullScreen == fullScreen && includeTitle == prevIncludeTitle)) {
                Intent i = new Intent(v.getContext().getApplicationContext(), cls);
                i.putExtra("anywheresoftware.b4a.designer.includeTitle", includeTitle);
                i.putExtra("anywheresoftware.b4a.designer.fullScreen", fullScreen);
                cls.getMethod("restartActivity", new Class[]{Intent.class}).invoke(v.getContext(), new Object[]{i});
            }
        }
        return (View) prev;
    }
}
