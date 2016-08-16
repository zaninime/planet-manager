package eu.elos.planetmgr.app.common;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

import java.lang.reflect.Type;


public class JavascriptErrorSerializer implements JsonSerializer<JavascriptError> {
    @Override
    public JsonElement serialize(JavascriptError src, Type typeOfSrc, JsonSerializationContext context) {
        JsonObject error = new JsonObject();
        error.addProperty("name", src.getName());
        error.addProperty("message", src.getMessage());

        JsonObject element = new JsonObject();
        element.addProperty("result", "err");
        element.add("error", error);
        return element;
    }
}
