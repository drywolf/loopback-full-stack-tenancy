module.exports = function(app) {

  console.error('Started the import of sample data.');

  var User = app.models.User;
  
  User.create({email: 'test@test.com', password: 'test'}, function(err, user) {
	  if (err)
		console.log("User-Error: ", err);
  });
  
  var Pet = app.models.Pet;
  var Person = app.models.Person;
  
  var family1 = app.dataSources.family1;
  var family2 = app.dataSources.family2;
  var family3 = app.dataSources.family3;

  Promise.resolve()
  .then(function()
  {
	  Person.attachTo(family1);
	  Pet.attachTo(family1);
	  console.log("family1 attached");
  })
  .then(function()
  {
	  console.log("create John");
	  return Person.create({name: 'John'});
  })
  .then(function(john)
  {
	  return john.pets.create({ name: 'kitty', species: 'cat' });
  })
  
  .then(function()
  {
	  Person.attachTo(family2);
	  Pet.attachTo(family2);
	  console.log("family2 attached");
  })
  .then(function()
  {
	  console.log("create Simon");
	  return Person.create({name: 'Simon'});
  })
  .then(function(simon)
  {
	  return simon.pets.create({ name: 'waldo', species: 'dog' });
  })
  
  .then(function()
  {
	  Person.attachTo(family3);
	  Pet.attachTo(family3);
	  console.log("family3 attached");
  })
  .then(function()
  {
	  console.log("create Walter");
	  return Person.create({name: 'Walter'});
  })
  .then(function(walter)
  {
	  return walter.pets.create({ name: 'goldie', species: 'fish' });
  })
  
  .then(function(result)
  {
	  console.log("Success");
	  
	Person.find({include: 'pets'}, function(err, items) {
	  console.log("2 -> ", items); // => [] of items in the server’s memory db
	  try
	  {
	  	  console.log("relation-sync: ", items[0].pets());
	  }
	  catch(e)
	  {
		console.log("error-sync: ", e);
	  }

	  items[0].pets(function(err, pets)
	  {
		console.log("relation-async: ", pets);
		
		if (err)
			console.log("error-async: ", err);
	  });
	});
  })
  .catch(function(err) { console.log("Err: ", err); });
    

  
  /*Person.attachTo(family2);
  Person.create({name: 'Simon'}, function(err, person) {
	  if (err)
		console.log("Person-Error: ", err);
	
    console.log("Person: ", person);
  });*/
};
