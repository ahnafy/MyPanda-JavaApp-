package anywheresoftware.b4a.objects;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.View.OnLongClickListener;
import android.view.ViewGroup;
import anywheresoftware.b4a.AbsObjectWrapper;
import anywheresoftware.b4a.BA;
import anywheresoftware.b4a.BA.B4aDebuggable;
import anywheresoftware.b4a.BA.Hide;
import anywheresoftware.b4a.BA.Pixel;
import anywheresoftware.b4a.BALayout.LayoutParams;
import anywheresoftware.b4a.keywords.Common;
import anywheresoftware.b4a.keywords.LayoutBuilder.ViewWrapperAndAnchor;
import anywheresoftware.b4a.objects.drawable.BitmapDrawable;
import anywheresoftware.b4a.objects.drawable.ColorDrawable;
import anywheresoftware.b4a.objects.drawable.ColorDrawable.GradientDrawableWithCorners;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;

@Hide
public class ViewWrapper<T extends View> extends AbsObjectWrapper<T> implements B4aDebuggable {
    @Hide
    public static final int defaultColor = -984833;
    @Hide
    public static int lastId = 0;
    protected BA ba;

    public void Initialize(BA ba, String EventName) {
        innerInitialize(ba, EventName.toLowerCase(BA.cul), false);
    }

    @Hide
    public void innerInitialize(final BA ba, final String eventName, boolean keepOldObject) {
        this.ba = ba;
        View view = (View) getObject();
        int i = lastId + 1;
        lastId = i;
        view.setId(i);
        if (ba.subExists(new StringBuilder(String.valueOf(eventName)).append("_click").toString())) {
            ((View) getObject()).setOnClickListener(new OnClickListener() {
                public void onClick(View v) {
                    ba.raiseEvent(v, eventName + "_click", new Object[0]);
                }
            });
        }
        if (ba.subExists(new StringBuilder(String.valueOf(eventName)).append("_longclick").toString())) {
            ((View) getObject()).setOnLongClickListener(new OnLongClickListener() {
                public boolean onLongClick(View v) {
                    ba.raiseEvent(v, eventName + "_longclick", new Object[0]);
                    return true;
                }
            });
        }
    }

    public Drawable getBackground() {
        return ((View) getObject()).getBackground();
    }

    public void setBackground(Drawable drawable) {
        ((View) getObject()).setBackgroundDrawable(drawable);
    }

    public void SetBackgroundImage(Bitmap Bitmap) {
        BitmapDrawable bd = new BitmapDrawable();
        bd.Initialize(Bitmap);
        ((View) getObject()).setBackgroundDrawable((Drawable) bd.getObject());
    }

    public void Invalidate() {
        ((View) getObject()).invalidate();
    }

    public void Invalidate2(Rect Rect) {
        ((View) getObject()).invalidate(Rect);
    }

    public void Invalidate3(int Left, int Top, int Right, int Bottom) {
        ((View) getObject()).invalidate(Left, Top, Right, Bottom);
    }

    public void setWidth(@Pixel int width) {
        ((View) getObject()).getLayoutParams().width = width;
        ((View) getObject()).getParent().requestLayout();
    }

    public int getWidth() {
        return ((View) getObject()).getLayoutParams().width;
    }

    public int getHeight() {
        return ((View) getObject()).getLayoutParams().height;
    }

    public int getLeft() {
        return ((LayoutParams) ((View) getObject()).getLayoutParams()).left;
    }

    public int getTop() {
        return ((LayoutParams) ((View) getObject()).getLayoutParams()).top;
    }

    public void setHeight(@Pixel int height) {
        ((View) getObject()).getLayoutParams().height = height;
        ((View) getObject()).getParent().requestLayout();
    }

    public void setLeft(@Pixel int left) {
        ((LayoutParams) ((View) getObject()).getLayoutParams()).left = left;
        ((View) getObject()).getParent().requestLayout();
    }

    public void setTop(@Pixel int top) {
        ((LayoutParams) ((View) getObject()).getLayoutParams()).top = top;
        ((View) getObject()).getParent().requestLayout();
    }

    public void setColor(int color) {
        Drawable d = ((View) getObject()).getBackground();
        if (d == null || !(d instanceof GradientDrawable)) {
            ((View) getObject()).setBackgroundColor(color);
            return;
        }
        float radius = Common.Density;
        if (d instanceof GradientDrawableWithCorners) {
            radius = ((GradientDrawableWithCorners) d).cornerRadius;
        } else {
            GradientDrawable g = (GradientDrawable) ((View) getObject()).getBackground();
            try {
                Field state = g.getClass().getDeclaredField("mGradientState");
                state.setAccessible(true);
                Object gstate = state.get(g);
                radius = ((Float) gstate.getClass().getDeclaredField("mRadius").get(gstate)).floatValue();
            } catch (Exception e) {
                Common.Log(e.toString());
            }
        }
        ColorDrawable cd = new ColorDrawable();
        cd.Initialize(color, (int) radius);
        ((View) getObject()).setBackgroundDrawable((Drawable) cd.getObject());
    }

    public void setTag(Object tag) {
        ((View) getObject()).setTag(tag);
    }

    public Object getTag() {
        return ((View) getObject()).getTag();
    }

    public void setVisible(boolean Visible) {
        ((View) getObject()).setVisibility(Visible ? 0 : 8);
    }

    public boolean getVisible() {
        return ((View) getObject()).getVisibility() == 0;
    }

    public void setEnabled(boolean Enabled) {
        ((View) getObject()).setEnabled(Enabled);
    }

    public boolean getEnabled() {
        return ((View) getObject()).isEnabled();
    }

    public void BringToFront() {
        if (((View) getObject()).getParent() instanceof ViewGroup) {
            ViewGroup vg = (ViewGroup) ((View) getObject()).getParent();
            vg.removeView((View) getObject());
            vg.addView((View) getObject());
        }
    }

    public void SendToBack() {
        if (((View) getObject()).getParent() instanceof ViewGroup) {
            ViewGroup vg = (ViewGroup) ((View) getObject()).getParent();
            vg.removeView((View) getObject());
            vg.addView((View) getObject(), 0);
        }
    }

    public void RemoveView() {
        if (((View) getObject()).getParent() instanceof ViewGroup) {
            ((ViewGroup) ((View) getObject()).getParent()).removeView((View) getObject());
        }
    }

    public void SetLayout(@Pixel int Left, @Pixel int Top, @Pixel int Width, @Pixel int Height) {
        LayoutParams lp = (LayoutParams) ((View) getObject()).getLayoutParams();
        lp.left = Left;
        lp.top = Top;
        lp.width = Width;
        lp.height = Height;
        ((View) getObject()).getParent().requestLayout();
    }

    public boolean RequestFocus() {
        return ((View) getObject()).requestFocus();
    }

    @Hide
    public String toString() {
        String s = baseToString();
        if (!IsInitialized()) {
            return s;
        }
        s = new StringBuilder(String.valueOf(s)).append(": ").toString();
        if (!getEnabled()) {
            s = new StringBuilder(String.valueOf(s)).append("Enabled=false, ").toString();
        }
        if (!getVisible()) {
            s = new StringBuilder(String.valueOf(s)).append("Visible=false, ").toString();
        }
        if (((View) getObject()).getLayoutParams() == null || !(((View) getObject()).getLayoutParams() instanceof LayoutParams)) {
            s = new StringBuilder(String.valueOf(s)).append("Layout not available").toString();
        } else {
            s = new StringBuilder(String.valueOf(s)).append("Left=").append(getLeft()).append(", Top=").append(getTop()).append(", Width=").append(getWidth()).append(", Height=").append(getHeight()).toString();
        }
        if (getTag() != null) {
            return new StringBuilder(String.valueOf(s)).append(", Tag=").append(getTag().toString()).toString();
        }
        return s;
    }

    @Hide
    public static View build(Object prev, Map<String, Object> props, boolean designer) throws Exception {
        View v = (View) prev;
        if (v.getTag() == null && designer) {
            HashMap<String, Object> defaults = new HashMap();
            defaults.put("background", v.getBackground());
            v.setTag(defaults);
        }
        LayoutParams lp = (LayoutParams) v.getLayoutParams();
        if (lp == null) {
            lp = new LayoutParams();
            v.setLayoutParams(lp);
        }
        lp.setFromUserPlane(((Integer) props.get("left")).intValue(), ((Integer) props.get("top")).intValue(), ((Integer) props.get("width")).intValue(), ((Integer) props.get("height")).intValue());
        v.setEnabled(((Boolean) props.get("enabled")).booleanValue());
        if (!designer) {
            int visible = 0;
            if (!((Boolean) props.get("visible")).booleanValue()) {
                visible = 8;
            }
            v.setVisibility(visible);
            v.setTag(props.get("tag"));
        }
        return v;
    }

    @Hide
    public static void fixAnchor(int pw, int ph, ViewWrapperAndAnchor vwa) {
        if (vwa.hanchor == ViewWrapperAndAnchor.RIGHT) {
            vwa.right = vwa.vw.getLeft();
            vwa.vw.setLeft((pw - vwa.right) - vwa.vw.getWidth());
        } else if (vwa.hanchor == ViewWrapperAndAnchor.BOTH) {
            vwa.right = vwa.vw.getWidth();
            vwa.vw.setWidth((pw - vwa.right) - vwa.vw.getLeft());
        }
        if (vwa.vanchor == ViewWrapperAndAnchor.BOTTOM) {
            vwa.bottom = vwa.vw.getTop();
            vwa.vw.setTop((ph - vwa.bottom) - vwa.vw.getHeight());
        } else if (vwa.vanchor == ViewWrapperAndAnchor.BOTH) {
            vwa.bottom = vwa.vw.getHeight();
            vwa.vw.setHeight((ph - vwa.bottom) - vwa.vw.getTop());
        }
    }

    @Hide
    public Object[] debug(int limit, boolean[] outShouldAddReflectionFields) {
        Object[] res = new Object[]{"ToString", toString()};
        outShouldAddReflectionFields[0] = true;
        return res;
    }

    @Hide
    public static <T> T buildNativeView(Context context, Class<T> cls, HashMap<String, Object> props, boolean designer) throws IllegalArgumentException, SecurityException, InstantiationException, IllegalAccessException, InvocationTargetException, NoSuchMethodException, ClassNotFoundException {
        Class<?> c;
        String overideClass = (String) props.get("nativeClass");
        if (overideClass != null && overideClass.startsWith(".")) {
            overideClass = new StringBuilder(String.valueOf(BA.applicationContext.getPackageName())).append(overideClass).toString();
        }
        if (!(designer || overideClass == null)) {
            try {
                if (overideClass.length() != 0) {
                    c = Class.forName(overideClass);
                    return c.getConstructor(new Class[]{Context.class}).newInstance(new Object[]{context});
                }
            } catch (ClassNotFoundException e) {
                int i = overideClass.lastIndexOf(".");
                c = Class.forName(overideClass.substring(0, i) + "$" + overideClass.substring(i + 1));
            }
        }
        c = cls;
        return c.getConstructor(new Class[]{Context.class}).newInstance(new Object[]{context});
    }

    @Hide
    public static Object getDefault(View v, String key, Object defaultValue) {
        HashMap<String, Object> map = (HashMap) v.getTag();
        if (map.containsKey(key)) {
            return map.get(key);
        }
        map.put(key, defaultValue);
        return defaultValue;
    }
}
