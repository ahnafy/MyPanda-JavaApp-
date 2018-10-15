package anywheresoftware.b4a.http;

import android.util.Log;
import anywheresoftware.b4a.BA;
import anywheresoftware.b4a.BA.CheckForReinitialize;
import anywheresoftware.b4a.BA.Hide;
import anywheresoftware.b4a.BA.ShortName;
import anywheresoftware.b4a.BA.Version;
import anywheresoftware.b4a.objects.collections.Map;
import anywheresoftware.b4a.objects.streams.File.InputStreamWrapper;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.List;
import javax.net.ssl.KeyManager;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import org.apache.http.Header;
import org.apache.http.HttpHost;
import org.apache.http.HttpResponse;
import org.apache.http.ParseException;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpHead;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.conn.ConnectionPoolTimeoutException;
import org.apache.http.conn.ConnectionReleaseTrigger;
import org.apache.http.conn.params.ConnManagerParams;
import org.apache.http.conn.params.ConnPerRoute;
import org.apache.http.conn.routing.HttpRoute;
import org.apache.http.conn.scheme.PlainSocketFactory;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.scheme.SchemeRegistry;
import org.apache.http.conn.ssl.SSLSocketFactory;
import org.apache.http.entity.AbstractHttpEntity;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.entity.InputStreamEntity;
import org.apache.http.impl.auth.BasicScheme;
import org.apache.http.impl.auth.DigestScheme;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.tsccm.ThreadSafeClientConnManager;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.params.HttpParams;
import org.apache.http.util.EntityUtils;

@Version(1.36f)
@ShortName("HttpClient")
public class HttpClientWrapper implements CheckForReinitialize {
    private static final int maxConnectionToRoute = 5;
    @Hide
    public DefaultHttpClient client;
    private String eventName;

    /* renamed from: anywheresoftware.b4a.http.HttpClientWrapper$1 */
    class C00081 implements ConnPerRoute {
        C00081() {
        }

        public int getMaxForRoute(HttpRoute route) {
            return 5;
        }
    }

    class ExecuteHelper implements Runnable {
        private HttpUriRequestWrapper HttpRequest;
        private String Password;
        private int TaskId;
        private String UserName;
        private BA ba;

        public ExecuteHelper(BA ba, HttpUriRequestWrapper HttpRequest, int TaskId, String UserName, String Password) {
            this.ba = ba;
            this.HttpRequest = HttpRequest;
            this.TaskId = TaskId;
            this.UserName = UserName;
            this.Password = Password;
        }

        public void run() {
            HttpResponeWrapper res;
            String reason;
            int statusCode;
            HttpResponse response = null;
            try {
                if ((this.HttpRequest.req instanceof HttpEntityEnclosingRequestBase) && this.UserName != null && this.UserName.length() > 0) {
                    HttpEntityEnclosingRequestBase base = this.HttpRequest.req;
                    if (!(base.getEntity() == null || base.getEntity().isRepeatable())) {
                        this.HttpRequest.req.addHeader(new BasicScheme().authenticate(new UsernamePasswordCredentials(this.UserName, this.Password), this.HttpRequest.req));
                    }
                }
                response = HttpClientWrapper.this.executeWithTimeout(this, this.HttpRequest.req, this.ba, this.TaskId);
                if (response != null) {
                    if (response.getStatusLine().getStatusCode() == 401 && this.UserName != null && this.UserName.length() > 0) {
                        boolean basic = false;
                        boolean digest = false;
                        Header challenge = null;
                        for (Header h : response.getHeaders("WWW-Authenticate")) {
                            String v = h.getValue().toLowerCase(BA.cul);
                            if (v.contains("basic")) {
                                basic = true;
                            } else {
                                if (v.contains("digest")) {
                                    digest = true;
                                    challenge = h;
                                }
                            }
                        }
                        UsernamePasswordCredentials credentials = new UsernamePasswordCredentials(this.UserName, this.Password);
                        if (response.getEntity() != null) {
                            response.getEntity().consumeContent();
                        }
                        if (digest) {
                            DigestScheme ds = new DigestScheme();
                            ds.processChallenge(challenge);
                            this.HttpRequest.req.addHeader(ds.authenticate(credentials, this.HttpRequest.req));
                            response = HttpClientWrapper.this.executeWithTimeout(this, this.HttpRequest.req, this.ba, this.TaskId);
                            if (response == null) {
                                return;
                            }
                        } else if (basic) {
                            this.HttpRequest.req.addHeader(new BasicScheme().authenticate(credentials, this.HttpRequest.req));
                            response = HttpClientWrapper.this.executeWithTimeout(this, this.HttpRequest.req, this.ba, this.TaskId);
                            if (response == null) {
                                return;
                            }
                        }
                    }
                    if (response.getStatusLine().getStatusCode() / 100 != 2) {
                        throw new Exception();
                    }
                    res = new HttpResponeWrapper();
                    res.innerInitialize(HttpClientWrapper.this);
                    res.response = response;
                    this.ba.raiseEventFromDifferentThread(HttpClientWrapper.this.client, HttpClientWrapper.this, this.TaskId, new StringBuilder(String.valueOf(HttpClientWrapper.this.eventName)).append("_responsesuccess").toString(), true, new Object[]{res, Integer.valueOf(this.TaskId)});
                }
            } catch (Exception e) {
                if (response != null) {
                    reason = response.getStatusLine().getReasonPhrase();
                    statusCode = response.getStatusLine().getStatusCode();
                } else {
                    e.printStackTrace();
                    reason = e.toString();
                    statusCode = -1;
                }
                Method m = (Method) this.ba.htSubs.get(new StringBuilder(String.valueOf(HttpClientWrapper.this.eventName)).append("_responseerror").toString());
                boolean shouldClose = true;
                if (m != null) {
                    Object[] args;
                    if (m.getParameterTypes().length == 4 || BA.shellMode) {
                        res = null;
                        if (response != null) {
                            res = new HttpResponeWrapper();
                            res.innerInitialize(HttpClientWrapper.this);
                            res.response = response;
                            try {
                                response.setEntity(new ByteArrayEntity(EntityUtils.toByteArray(response.getEntity())));
                            } catch (Exception ee) {
                                ee.printStackTrace();
                            }
                        }
                        args = new Object[]{res, reason, Integer.valueOf(statusCode), Integer.valueOf(this.TaskId)};
                    } else {
                        args = new Object[]{reason, Integer.valueOf(statusCode), Integer.valueOf(this.TaskId)};
                    }
                    shouldClose = false;
                    this.ba.raiseEventFromDifferentThread(HttpClientWrapper.this.client, HttpClientWrapper.this, this.TaskId, new StringBuilder(String.valueOf(HttpClientWrapper.this.eventName)).append("_responseerror").toString(), false, args);
                }
                if (shouldClose && response != null && response.getEntity() != null) {
                    try {
                        response.getEntity().consumeContent();
                    } catch (Throwable e1) {
                        Log.w("B4A", e1);
                    }
                }
            }
        }
    }

    @ShortName("HttpResponse")
    public static class HttpResponeWrapper {
        private HttpClientWrapper parent;
        private HttpResponse response;

        private void innerInitialize(HttpClientWrapper parent) {
            this.parent = parent;
        }

        public InputStreamWrapper GetInputStream() throws IllegalStateException, IOException {
            InputStreamWrapper isw = new InputStreamWrapper();
            isw.setObject(this.response.getEntity().getContent());
            return isw;
        }

        public String GetString(String DefaultCharset) throws ParseException, IOException {
            if (this.response.getEntity() == null) {
                return "";
            }
            return EntityUtils.toString(this.response.getEntity(), DefaultCharset);
        }

        public Map GetHeaders() {
            return convertHeaders(this.response.getAllHeaders());
        }

        static Map convertHeaders(Header[] headers) {
            Map m = new Map();
            m.Initialize();
            for (Header h : headers) {
                List<Object> l = (List) m.Get(h.getName());
                if (l == null) {
                    anywheresoftware.b4a.objects.collections.List ll = new anywheresoftware.b4a.objects.collections.List();
                    ll.Initialize();
                    l = (List) ll.getObject();
                    m.Put(h.getName(), l);
                }
                l.add(h.getValue());
            }
            return m;
        }

        public String getContentType() {
            return this.response.getEntity().getContentType().getValue();
        }

        public void Release() throws IOException {
            if (this.response != null && this.response.getEntity() != null) {
                this.response.getEntity().consumeContent();
            }
        }

        public String getContentEncoding() {
            return this.response.getEntity().getContentEncoding().getValue();
        }

        public long getContentLength() {
            return this.response.getEntity().getContentLength();
        }

        public int getStatusCode() {
            return this.response.getStatusLine().getStatusCode();
        }

        public boolean GetAsynchronously(BA ba, String EventName, OutputStream Output, boolean CloseOutput, int TaskId) throws IOException {
            if (BA.isTaskRunning(this.parent, TaskId)) {
                Release();
                return false;
            }
            final OutputStream outputStream = Output;
            final boolean z = CloseOutput;
            final BA ba2 = ba;
            final int i = TaskId;
            final String str = EventName;
            BA.submitRunnable(new Runnable() {
                public void run() {
                    boolean abortConnection = false;
                    try {
                        HttpResponeWrapper.this.response.getEntity().writeTo(outputStream);
                        if (z) {
                            outputStream.close();
                        }
                        ba2.raiseEventFromDifferentThread(HttpResponeWrapper.this.response, HttpResponeWrapper.this.parent, i, new StringBuilder(String.valueOf(str.toLowerCase(BA.cul))).append("_streamfinish").toString(), true, new Object[]{Boolean.valueOf(true), Integer.valueOf(i)});
                    } catch (IOException e) {
                        abortConnection = true;
                        ba2.setLastException(e);
                        if (z) {
                            try {
                                outputStream.close();
                            } catch (IOException e2) {
                            }
                        }
                        ba2.raiseEventFromDifferentThread(HttpResponeWrapper.this.response, HttpResponeWrapper.this.parent, i, new StringBuilder(String.valueOf(str.toLowerCase(BA.cul))).append("_streamfinish").toString(), true, new Object[]{Boolean.valueOf(false), Integer.valueOf(i)});
                    }
                    if (abortConnection) {
                        try {
                            if (HttpResponeWrapper.this.response.getEntity() instanceof ConnectionReleaseTrigger) {
                                ((ConnectionReleaseTrigger) HttpResponeWrapper.this.response.getEntity()).abortConnection();
                                return;
                            }
                        } catch (IOException e3) {
                            Log.w("B4A", e3);
                            return;
                        }
                    }
                    HttpResponeWrapper.this.response.getEntity().consumeContent();
                }
            }, this.parent, TaskId);
            return true;
        }
    }

    @ShortName("HttpRequest")
    public static class HttpUriRequestWrapper {
        private boolean POST;
        private AbstractHttpEntity entity;
        @Hide
        public HttpRequestBase req;

        public void InitializeGet(String URL) {
            this.req = new HttpGet(URL);
            this.POST = false;
            sharedInit();
        }

        public void InitializeHead(String URL) {
            this.req = new HttpHead(URL);
            this.POST = false;
            sharedInit();
        }

        public void InitializeDelete(String URL) {
            this.req = new HttpDelete(URL);
            this.POST = false;
            sharedInit();
        }

        public void InitializePost(String URL, InputStream InputStream, int Length) {
            HttpPost post = new HttpPost(URL);
            this.req = post;
            this.entity = new InputStreamEntity(InputStream, (long) Length);
            post.setEntity(this.entity);
            this.entity.setContentType("application/x-www-form-urlencoded");
            this.POST = true;
            sharedInit();
        }

        public void InitializePut(String URL, InputStream InputStream, int Length) {
            HttpPut post = new HttpPut(URL);
            this.req = post;
            this.entity = new InputStreamEntity(InputStream, (long) Length);
            post.setEntity(this.entity);
            this.entity.setContentType("application/x-www-form-urlencoded");
            this.POST = true;
            sharedInit();
        }

        public void InitializePost2(String URL, byte[] Data) {
            HttpPost post = new HttpPost(URL);
            this.req = post;
            this.entity = new ByteArrayEntity(Data);
            post.setEntity(this.entity);
            this.entity.setContentType("application/x-www-form-urlencoded");
            this.POST = true;
            sharedInit();
        }

        public void InitializePut2(String URL, byte[] Data) {
            HttpPut post = new HttpPut(URL);
            this.req = post;
            this.entity = new ByteArrayEntity(Data);
            post.setEntity(this.entity);
            this.entity.setContentType("application/x-www-form-urlencoded");
            this.POST = true;
            sharedInit();
        }

        private void sharedInit() {
            setTimeout(30000);
        }

        public void SetContentType(String ContentType) {
            if (this.POST) {
                this.entity.setContentType(ContentType);
                return;
            }
            throw new RuntimeException("Only Post / Put requests support this method.");
        }

        public void SetContentEncoding(String Encoding) {
            if (this.POST) {
                this.entity.setContentEncoding(Encoding);
                return;
            }
            throw new RuntimeException("Only Post / Put requests support this method.");
        }

        public void setTimeout(int Timeout) {
            HttpConnectionParams.setConnectionTimeout(this.req.getParams(), Timeout);
            HttpConnectionParams.setSoTimeout(this.req.getParams(), Timeout);
        }

        public void SetHeader(String Name, String Value) {
            this.req.setHeader(Name, Value);
        }

        public void RemoveHeaders(String Name) {
            this.req.removeHeaders(Name);
        }
    }

    private static class NaiveTrustManager implements X509TrustManager {
        private NaiveTrustManager() {
        }

        public void checkClientTrusted(X509Certificate[] cert, String authType) throws CertificateException {
        }

        public void checkServerTrusted(X509Certificate[] cert, String authType) throws CertificateException {
        }

        public X509Certificate[] getAcceptedIssuers() {
            return null;
        }
    }

    public static void LIBRARY_DOC() {
    }

    public void Initialize(String EventName) throws ClientProtocolException, IOException {
        initializeShared(EventName, SSLSocketFactory.getSocketFactory());
    }

    private void initializeShared(String EventName, SSLSocketFactory ssl) {
        this.eventName = EventName.toLowerCase(BA.cul);
        SchemeRegistry schemeRegistry = new SchemeRegistry();
        schemeRegistry.register(new Scheme("http", PlainSocketFactory.getSocketFactory(), 80));
        schemeRegistry.register(new Scheme("https", ssl, 443));
        HttpParams params = new BasicHttpParams();
        ConnManagerParams.setMaxConnectionsPerRoute(params, new C00081());
        ConnManagerParams.setTimeout(params, 100);
        this.client = new DefaultHttpClient(new ThreadSafeClientConnManager(params, schemeRegistry), params);
    }

    public void InitializeAcceptAll(String EventName) throws KeyManagementException, NoSuchAlgorithmException, SecurityException, NoSuchMethodException, IllegalArgumentException, InstantiationException, IllegalAccessException, InvocationTargetException {
        TrustManager[] tm = new TrustManager[]{new NaiveTrustManager()};
        SSLContext.getInstance("TLS").init(new KeyManager[0], tm, new SecureRandom());
        SSLSocketFactory ssl = (SSLSocketFactory) SSLSocketFactory.class.getConstructor(new Class[]{javax.net.ssl.SSLSocketFactory.class}).newInstance(new Object[]{context.getSocketFactory()});
        ssl.setHostnameVerifier(SSLSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);
        initializeShared(EventName, ssl);
    }

    public boolean IsInitialized() {
        return this.client != null;
    }

    public void SetHttpParameter(String Name, Object Value) {
        this.client.getParams().setParameter(Name, Value);
    }

    public void SetProxy(String Host, int Port, String Scheme) {
        this.client.getParams().setParameter("http.route.default-proxy", new HttpHost(Host, Port, Scheme));
    }

    public void SetProxy2(String Host, int Port, String Scheme, String Username, String Password) {
        HttpHost hh = new HttpHost(Host, Port, Scheme);
        this.client.getCredentialsProvider().setCredentials(new AuthScope(Host, Port), new UsernamePasswordCredentials(Username, Password));
        this.client.getParams().setParameter("http.route.default-proxy", hh);
    }

    public boolean Execute(BA ba, HttpUriRequestWrapper HttpRequest, int TaskId) throws ClientProtocolException, IOException {
        return ExecuteCredentials(ba, HttpRequest, TaskId, null, null);
    }

    public boolean ExecuteCredentials(BA ba, HttpUriRequestWrapper HttpRequest, int TaskId, String UserName, String Password) throws ClientProtocolException, IOException {
        if (BA.isTaskRunning(this, TaskId)) {
            return false;
        }
        BA.submitRunnable(new ExecuteHelper(ba, HttpRequest, TaskId, UserName, Password), this, TaskId);
        return true;
    }

    private HttpResponse executeWithTimeout(final Runnable handler, HttpUriRequest req, BA ba, final int TaskId) throws ClientProtocolException, IOException {
        try {
            return this.client.execute(req);
        } catch (ConnectionPoolTimeoutException e) {
            BA.handler.postDelayed(new Runnable() {
                public void run() {
                    BA.submitRunnable(handler, HttpClientWrapper.this, TaskId);
                }
            }, 2000);
            return null;
        }
    }
}
