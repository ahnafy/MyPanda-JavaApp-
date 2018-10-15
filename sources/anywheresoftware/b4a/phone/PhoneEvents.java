package anywheresoftware.b4a.phone;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.ContentObserver;
import android.database.Cursor;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.telephony.SmsMessage;
import anywheresoftware.b4a.AbsObjectWrapper;
import anywheresoftware.b4a.BA;
import anywheresoftware.b4a.BA.B4ARunnable;
import anywheresoftware.b4a.BA.ShortName;
import anywheresoftware.b4a.objects.IntentWrapper;
import anywheresoftware.b4a.phone.Phone.PhoneId;
import java.util.HashMap;
import java.util.Map.Entry;

@ShortName("PhoneEvents")
public class PhoneEvents {
    private BA ba;
    private BroadcastReceiver br;
    private String ev;
    private HashMap<String, ActionHandler> map = new HashMap();

    private abstract class ActionHandler {
        public String action;
        public String event;
        public int resultCode;

        public abstract void handle(Intent intent);

        private ActionHandler() {
        }

        protected void send(Intent intent, Object[] args) {
            Object[] o;
            if (args == null) {
                o = new Object[1];
            } else {
                o = new Object[(args.length + 1)];
                System.arraycopy(args, 0, o, 0, args.length);
            }
            o[o.length - 1] = AbsObjectWrapper.ConvertToWrapper(new IntentWrapper(), intent);
            if (BA.debugMode) {
                BA.handler.post(new B4ARunnable() {
                    public void run() {
                        PhoneEvents.this.ba.raiseEvent(this, new StringBuilder(String.valueOf(PhoneEvents.this.ev)).append(ActionHandler.this.event).toString(), o);
                    }
                });
            } else {
                PhoneEvents.this.ba.raiseEvent(this, new StringBuilder(String.valueOf(PhoneEvents.this.ev)).append(this.event).toString(), o);
            }
        }
    }

    /* renamed from: anywheresoftware.b4a.phone.PhoneEvents$1 */
    class C00531 extends ActionHandler {
        C00531() {
            super();
            this.event = "_texttospeechfinish";
        }

        public void handle(Intent intent) {
            send(intent, null);
        }
    }

    /* renamed from: anywheresoftware.b4a.phone.PhoneEvents$2 */
    class C00542 extends ActionHandler {
        C00542() {
            super();
            this.event = "_connectivitychanged";
        }

        public void handle(Intent intent) {
            NetworkInfo ni = (NetworkInfo) intent.getParcelableExtra("networkInfo");
            String type = ni.getTypeName();
            String state = ni.getState().toString();
            send(intent, new Object[]{type, state});
        }
    }

    /* renamed from: anywheresoftware.b4a.phone.PhoneEvents$3 */
    class C00553 extends ActionHandler {
        C00553() {
            super();
            this.event = "_userpresent";
        }

        public void handle(Intent intent) {
            send(intent, null);
        }
    }

    /* renamed from: anywheresoftware.b4a.phone.PhoneEvents$4 */
    class C00564 extends ActionHandler {
        C00564() {
            super();
            this.event = "_shutdown";
        }

        public void handle(Intent intent) {
            send(intent, null);
        }
    }

    /* renamed from: anywheresoftware.b4a.phone.PhoneEvents$5 */
    class C00575 extends ActionHandler {
        C00575() {
            super();
            this.event = "_screenon";
        }

        public void handle(Intent intent) {
            send(intent, null);
        }
    }

    /* renamed from: anywheresoftware.b4a.phone.PhoneEvents$6 */
    class C00586 extends ActionHandler {
        C00586() {
            super();
            this.event = "_screenoff";
        }

        public void handle(Intent intent) {
            send(intent, null);
        }
    }

    /* renamed from: anywheresoftware.b4a.phone.PhoneEvents$7 */
    class C00597 extends ActionHandler {
        C00597() {
            super();
            this.event = "_packageremoved";
        }

        public void handle(Intent intent) {
            send(intent, new Object[]{intent.getDataString()});
        }
    }

    /* renamed from: anywheresoftware.b4a.phone.PhoneEvents$8 */
    class C00608 extends ActionHandler {
        C00608() {
            super();
            this.event = "_packageadded";
        }

        public void handle(Intent intent) {
            send(intent, new Object[]{intent.getDataString()});
        }
    }

    /* renamed from: anywheresoftware.b4a.phone.PhoneEvents$9 */
    class C00619 extends ActionHandler {
        C00619() {
            super();
            this.event = "_devicestoragelow";
        }

        public void handle(Intent intent) {
            send(intent, null);
        }
    }

    @ShortName("SmsInterceptor")
    public static class SMSInterceptor {
        private BA ba;
        private BroadcastReceiver br;
        private String eventName;

        public void Initialize(String EventName, BA ba) {
            Initialize2(EventName, ba, 0);
        }

        public void ListenToOutgoingMessages() {
            final Uri content = Uri.parse("content://sms");
            BA.applicationContext.getContentResolver().registerContentObserver(content, true, new ContentObserver(new Handler()) {
                public void onChange(boolean selfChange) {
                    super.onChange(selfChange);
                    Cursor cursor = BA.applicationContext.getContentResolver().query(content, null, null, null, null);
                    if (cursor.moveToNext()) {
                        String protocol = cursor.getString(cursor.getColumnIndex("protocol"));
                        int type = cursor.getInt(cursor.getColumnIndex("type"));
                        if (protocol == null && type == 2) {
                            SMSInterceptor.this.ba.raiseEvent(null, new StringBuilder(String.valueOf(SMSInterceptor.this.eventName)).append("_messagesent").toString(), Integer.valueOf(cursor.getInt(cursor.getColumnIndex("_id"))));
                            cursor.close();
                        }
                    }
                }
            });
        }

        public void Initialize2(String EventName, final BA ba, int Priority) {
            this.ba = ba;
            this.eventName = EventName.toLowerCase(BA.cul);
            this.br = new BroadcastReceiver() {
                public void onReceive(Context context, Intent intent) {
                    if (intent.getAction().equals("android.provider.Telephony.SMS_RECEIVED")) {
                        Bundle bundle = intent.getExtras();
                        if (bundle != null) {
                            Object[] pduObj = (Object[]) bundle.get("pdus");
                            for (Object obj : pduObj) {
                                SmsMessage sm = SmsMessage.createFromPdu((byte[]) obj);
                                Boolean res = (Boolean) ba.raiseEvent(SMSInterceptor.this, new StringBuilder(String.valueOf(SMSInterceptor.this.eventName)).append("_messagereceived").toString(), sm.getOriginatingAddress(), sm.getMessageBody());
                                if (res != null && res.booleanValue()) {
                                    abortBroadcast();
                                }
                            }
                        }
                    }
                }
            };
            IntentFilter fil = new IntentFilter("android.provider.Telephony.SMS_RECEIVED");
            fil.setPriority(Priority);
            BA.applicationContext.registerReceiver(this.br, fil);
        }

        public void StopListening() {
            if (this.br != null) {
                BA.applicationContext.unregisterReceiver(this.br);
            }
            this.br = null;
        }
    }

    public PhoneEvents() {
        this.map.put("android.speech.tts.TTS_QUEUE_PROCESSING_COMPLETED", new C00531());
        this.map.put("android.net.conn.CONNECTIVITY_CHANGE", new C00542());
        this.map.put("android.intent.action.USER_PRESENT", new C00553());
        this.map.put("android.intent.action.ACTION_SHUTDOWN", new C00564());
        this.map.put("android.intent.action.SCREEN_ON", new C00575());
        this.map.put("android.intent.action.SCREEN_OFF", new C00586());
        this.map.put("android.intent.action.PACKAGE_REMOVED", new C00597());
        this.map.put("android.intent.action.PACKAGE_ADDED", new C00608());
        this.map.put("android.intent.action.DEVICE_STORAGE_LOW", new C00619());
        this.map.put("b4a.smssent", new ActionHandler() {
            {
                this.event = "_smssentstatus";
            }

            public void handle(Intent intent) {
                boolean z;
                String msg = "";
                switch (this.resultCode) {
                    case -1:
                        msg = "OK";
                        break;
                    case 1:
                        msg = "GENERIC_FAILURE";
                        break;
                    case 2:
                        msg = "RADIO_OFF";
                        break;
                    case 3:
                        msg = "NULL_PDU";
                        break;
                    case 4:
                        msg = "NO_SERVICE";
                        break;
                }
                Object[] objArr = new Object[3];
                if (this.resultCode == -1) {
                    z = true;
                } else {
                    z = false;
                }
                objArr[0] = Boolean.valueOf(z);
                objArr[1] = msg;
                objArr[2] = intent.getStringExtra("phone");
                send(intent, objArr);
            }
        });
        this.map.put("b4a.smsdelivered", new ActionHandler() {
            {
                this.event = "_smsdelivered";
            }

            public void handle(Intent intent) {
                send(intent, new Object[]{intent.getStringExtra("phone")});
            }
        });
        this.map.put("android.intent.action.DEVICE_STORAGE_OK", new ActionHandler() {
            {
                this.event = "_devicestorageok";
            }

            public void handle(Intent intent) {
                send(intent, null);
            }
        });
        this.map.put("android.intent.action.BATTERY_CHANGED", new ActionHandler() {
            {
                this.event = "_batterychanged";
            }

            public void handle(Intent intent) {
                boolean plugged;
                int level = intent.getIntExtra("level", 0);
                int scale = intent.getIntExtra("scale", 1);
                if (intent.getIntExtra("plugged", 0) > 0) {
                    plugged = true;
                } else {
                    plugged = false;
                }
                send(intent, new Object[]{Integer.valueOf(level), Integer.valueOf(scale), Boolean.valueOf(plugged)});
            }
        });
        this.map.put("android.intent.action.AIRPLANE_MODE", new ActionHandler() {
            {
                this.event = "_airplanemodechanged";
            }

            public void handle(Intent intent) {
                boolean state = intent.getBooleanExtra("state", false);
                send(intent, new Object[]{Boolean.valueOf(state)});
            }
        });
        for (Entry<String, ActionHandler> e : this.map.entrySet()) {
            ((ActionHandler) e.getValue()).action = (String) e.getKey();
        }
    }

    public void InitializeWithPhoneState(BA ba, String EventName, PhoneId PhoneId) {
        this.map.put("android.intent.action.PHONE_STATE", new ActionHandler() {
            {
                this.event = "_phonestatechanged";
            }

            public void handle(Intent intent) {
                String state = intent.getStringExtra("state");
                String incomingNumber = intent.getStringExtra("incoming_number");
                if (incomingNumber == null) {
                    incomingNumber = "";
                }
                send(intent, new Object[]{state, incomingNumber});
            }
        });
        ((ActionHandler) this.map.get("android.intent.action.PHONE_STATE")).action = "android.intent.action.PHONE_STATE";
        Initialize(ba, EventName);
    }

    public void Initialize(BA ba, String EventName) {
        this.ba = ba;
        this.ev = EventName.toLowerCase(BA.cul);
        StopListening();
        this.br = new BroadcastReceiver() {
            public void onReceive(Context context, Intent intent) {
                if (intent.getAction() != null) {
                    ActionHandler ah = (ActionHandler) PhoneEvents.this.map.get(intent.getAction());
                    if (ah != null) {
                        ah.resultCode = getResultCode();
                        ah.handle(intent);
                    }
                }
            }
        };
        IntentFilter f1 = new IntentFilter();
        IntentFilter f2 = null;
        for (ActionHandler ah : this.map.values()) {
            if (ba.subExists(this.ev + ah.event)) {
                if (ah.action == "android.intent.action.PACKAGE_ADDED" || ah.action == "android.intent.action.PACKAGE_REMOVED") {
                    if (f2 == null) {
                        f2 = new IntentFilter();
                        f2.addDataScheme("package");
                    }
                    f2.addAction(ah.action);
                }
                f1.addAction(ah.action);
            }
        }
        BA.applicationContext.registerReceiver(this.br, f1);
        if (f2 != null) {
            BA.applicationContext.registerReceiver(this.br, f2);
        }
    }

    public void StopListening() {
        if (this.br != null) {
            BA.applicationContext.unregisterReceiver(this.br);
        }
        this.br = null;
    }
}
