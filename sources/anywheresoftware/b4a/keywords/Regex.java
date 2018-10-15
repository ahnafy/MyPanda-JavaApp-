package anywheresoftware.b4a.keywords;

import anywheresoftware.b4a.AbsObjectWrapper;
import anywheresoftware.b4a.BA.ShortName;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Regex {
    public static final int CASE_INSENSITIVE = 2;
    public static final int MULTILINE = 8;
    private static LinkedHashMap<PatternAndOptions, Pattern> cachedPatterns;

    @ShortName("Matcher")
    public static class MatcherWrapper extends AbsObjectWrapper<Matcher> {
        public boolean Find() {
            return ((Matcher) getObject()).find();
        }

        public String Group(int Index) {
            return ((Matcher) getObject()).group(Index);
        }

        public int getGroupCount() {
            return ((Matcher) getObject()).groupCount();
        }

        public String getMatch() {
            return ((Matcher) getObject()).group();
        }

        public int GetStart(int Index) {
            return ((Matcher) getObject()).start(Index);
        }

        public int GetEnd(int Index) {
            return ((Matcher) getObject()).end(Index);
        }
    }

    private static class PatternAndOptions {
        public final int options;
        public final String pattern;

        public PatternAndOptions(String pattern, int options) {
            this.pattern = pattern;
            this.options = options;
        }

        public int hashCode() {
            return ((this.options + 31) * 31) + (this.pattern == null ? 0 : this.pattern.hashCode());
        }

        public boolean equals(Object obj) {
            if (this == obj) {
                return true;
            }
            if (obj == null) {
                return false;
            }
            if (getClass() != obj.getClass()) {
                return false;
            }
            PatternAndOptions other = (PatternAndOptions) obj;
            if (this.options != other.options) {
                return false;
            }
            if (this.pattern == null) {
                if (other.pattern != null) {
                    return false;
                }
                return true;
            } else if (this.pattern.equals(other.pattern)) {
                return true;
            } else {
                return false;
            }
        }
    }

    private static Pattern getPattern(String pattern, int options) {
        if (cachedPatterns == null) {
            cachedPatterns = new LinkedHashMap();
        }
        PatternAndOptions po = new PatternAndOptions(pattern, options);
        Pattern p = (Pattern) cachedPatterns.get(po);
        if (p == null) {
            p = Pattern.compile(pattern, options);
            cachedPatterns.put(po, p);
            if (cachedPatterns.size() > 50) {
                Iterator<Entry<PatternAndOptions, Pattern>> it = cachedPatterns.entrySet().iterator();
                for (int i = 0; i < 25; i++) {
                    it.next();
                    it.remove();
                }
            }
        }
        return p;
    }

    public static boolean IsMatch(String Pattern, String Text) {
        return IsMatch2(Pattern, 0, Text);
    }

    public static boolean IsMatch2(String Pattern, int Options, String Text) {
        return getPattern(Pattern, Options).matcher(Text).matches();
    }

    public static String[] Split(String Pattern, String Text) {
        return Split2(Pattern, 0, Text);
    }

    public static String[] Split2(String Pattern, int Options, String Text) {
        return getPattern(Pattern, Options).split(Text);
    }

    public static MatcherWrapper Matcher(String Pattern, String Text) {
        return Matcher2(Pattern, 0, Text);
    }

    public static MatcherWrapper Matcher2(String Pattern, int Options, String Text) {
        MatcherWrapper mw = new MatcherWrapper();
        mw.setObject(getPattern(Pattern, Options).matcher(Text));
        return mw;
    }
}
