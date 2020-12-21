package com.utec.dbp10.suzytodos;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.util.Pair;

import android.content.Intent;
import android.os.Bundle;
import android.os.Parcelable;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.HashMap;

public class MainActivity extends AppCompatActivity {

    public static final String EXTRA_TEXT = "com.utec.dbp10.suzytodos.EXTRA_TEXT";
    public static final String EXTRA_ARRAY = "com.utec.dbp10.suzytodos.EXTRA_ARRAY";
    public static final String EXTRA_KEY = "com.utec.dbp10.suzytodos.EXTRA_POS";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    public void abrirtodos(View veiw) {
        EditText lusername = findViewById(R.id.lun);
        String username = lusername.getText().toString();
        EditText lpassword = findViewById(R.id.lp);
        String password = lpassword.getText().toString();
        String word = getString(R.string.general);
        HashMap<String, ArrayList<String>> tables = new HashMap<String, ArrayList<String>>();
        tables.put(word, new ArrayList<String>());
        String key = word;
        if(username.equals("") || password.equals("")) {
            String hint = getString(R.string.loginhint);
            Toast.makeText(getApplicationContext(), hint, Toast.LENGTH_SHORT).show();
        }
        else {
            lusername.setText("");
            lpassword.setText("");
            Intent intent = new Intent(this, todos.class);
            intent.putExtra(EXTRA_TEXT, username);
            intent.putExtra(EXTRA_ARRAY, tables);
            intent.putExtra(EXTRA_KEY, key);
            startActivity(intent);
        }
    }

    public void signup(View veiw) {
        EditText rusername = findViewById(R.id.run);
        String username = rusername.getText().toString();
        EditText rpassword = findViewById(R.id.rp);
        String password = rpassword.getText().toString();
        EditText remail = findViewById(R.id.re);
        String email = remail.getText().toString();

        if(username.equals("") || password.equals("") || email.equals("")) {
            String hint = getString(R.string.signuphint);
            Toast.makeText(getApplicationContext(), hint, Toast.LENGTH_SHORT).show();
        }
        else {
            rusername.setText("");
            rpassword.setText("");
            remail.setText("");
            String hint = getString(R.string.signupsuccess);
            Toast.makeText(getApplicationContext(), hint, Toast.LENGTH_SHORT).show();
        }
    }
}
