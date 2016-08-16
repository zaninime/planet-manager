package eu.elos.planetmgr.app.wifi.socket.data;


import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

import java.lang.reflect.Type;

public class FetchResponseSerializer implements JsonSerializer<FetchResponse> {
    @Override
    public JsonElement serialize(FetchResponse src, Type typeOfSrc, JsonSerializationContext context) {
        JsonObject element = new JsonObject();
        element.addProperty("result", "ok");
        element.addProperty("responseText", src.getResponseText());
        return element;
    }
}
