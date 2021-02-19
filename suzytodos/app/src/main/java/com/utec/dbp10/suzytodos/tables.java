package com.utec.dbp10.suzytodos;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.HashMap;

public class tables extends AppCompatActivity {

    public static final String EXTRA_TEXT = "com.utec.dbp10.suzytodos.EXTRA_TEXT";
    public static final String EXTRA_ARRAY = "com.utec.dbp10.suzytodos.EXTRA_ARRAY";
    public static final String EXTRA_KEY = "com.utec.dbp10.suzytodos.EXTRA_POS";

    ArrayList<String> tabless = new ArrayList<String>();
    ArrayAdapter<String> tableAdapter;
    ListView listView;
    String username;
    HashMap<String, ArrayList<String>> table;
    String key;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.tables);
        Intent intent = getIntent();
        username = intent.getStringExtra(MainActivity.EXTRA_TEXT);
        table = (HashMap<String, ArrayList<String>>) intent.getSerializableExtra(MainActivity.EXTRA_ARRAY);
        tabless.addAll(table.keySet());
        listView = findViewById(R.id.list);
        tableAdapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, tabless);
        listView.setAdapter(tableAdapter);
        setUpListViewListener();
    }

    private void setUpListViewListener() {
        listView.setOnItemLongClickListener(new AdapterView.OnItemLongClickListener() {
            @Override
            public boolean onItemLongClick(AdapterView<?> parent, View view, int position, long id) {
                Context context = getApplicationContext();
                if(tabless.get(position).equals("General")) {
                    String hint = getString(R.string.delgen);
                    Toast.makeText(context, hint, Toast.LENGTH_LONG).show();
                    return false;
                }
                String hint = getString(R.string.tabledelete);
                Toast.makeText(context, hint, Toast.LENGTH_LONG).show();
                String k = tabless.get(position);
                table.remove(k);
                tabless.remove(position);
                tableAdapter.notifyDataSetChanged();
                return true;
            }
        });

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                String k = tabless.get(position);
                key = k;
                abrirtodos(view);
            }
        });

    }


    public void addtable(View view) {
        EditText adder = findViewById(R.id.adder);
        String tableName = adder.getText().toString();
        for(String x: tabless) {
            if(x.equals(tableName)) {
                String hint = getString(R.string.addrep);
                Toast.makeText(getApplicationContext(), hint, Toast.LENGTH_LONG).show();
                adder.setText("");
                return;
            }
        }
        if(!(tableName.equals(""))) {
            table.put(tableName, new ArrayList<String>());
            tableAdapter.add(tableName);
            adder.setText("");
        }
        else {
            String hint = getString(R.string.tablename);
            Toast.makeText(getApplicationContext(), hint, Toast.LENGTH_LONG).show();
        }

    }


    public void abrirtodos(View veiw) {
        Intent intent = new Intent(this, todos.class);
        intent.putExtra(EXTRA_TEXT, username);
        intent.putExtra(EXTRA_ARRAY, table);
        intent.putExtra(EXTRA_KEY, key);
        startActivity(intent);
    }
}
