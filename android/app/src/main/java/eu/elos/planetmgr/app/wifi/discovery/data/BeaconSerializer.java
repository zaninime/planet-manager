package eu.elos.planetmgr.app.wifi.discovery.data;


import android.util.Base64;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

import java.lang.reflect.Type;

public class BeaconSerializer implements JsonSerializer<Beacon> {
    @Override
    public JsonElement serialize(Beacon src, Type typeOfSrc, JsonSerializationContext context) {
        JsonObject object = new JsonObject();
        object.addProperty("address", src.getAddress());
        object.addProperty("port", src.getPort());
        object.addProperty("content", Base64.encodeToString(src.getContent(), Base64.NO_WRAP));
        return object;
    }
}
