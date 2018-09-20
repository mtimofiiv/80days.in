---
layout: post
title:  "Let Postgres generate thouse updated_at timestamps for you"
date:   2018-09-10 11:33:41 +0200
tags: [ 'sql', 'postgres', 'postgresql', 'tech' ]
category: tech
masthead: https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Cygnus_Wall.jpg/1024px-Cygnus_Wall.jpg
---

Various ORMs (like Rails' ActiveRecord, Sequelize, etc) offer you the option of adding timestamps for the moment a record is created and updated. The created stamp is easy to do by simply giving it a default value of `NOW()`, but an `updated_at` stamp needs to change every time the row does.

But in a recent quest to simplify my projects, I needed an `updated_at` stamp but did not want to go through the trouble of manually writing it on every update. So I settled on doing the following in my Postgres database:

```sql
CREATE OR REPLACE FUNCTION updated_at_restamp_column()
  RETURNS TRIGGER AS $$
  BEGIN
    IF row(NEW.*) IS DISTINCT FROM row(OLD.*) THEN
      NEW.updated_at = NOW();
      RETURN NEW;
    ELSE
      RETURN OLD;
    END IF;
  END;
$$ language 'plpgsql';
```
