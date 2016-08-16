package eu.elos.planetmgr.app.common;


public class JavascriptError {
    private String name, message;

    public JavascriptError(String name, String message) {
        this.name = name;
        this.message = message;
    }

    public JavascriptError() {
    }

    public JavascriptError(Exception e) {
        this.name = e.getClass().getName();
        this.message = e.getLocalizedMessage();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
