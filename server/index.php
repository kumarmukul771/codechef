<?php
require_once '/include/dbHandler.php';
require_once '/lib/Slim/Slim/Slim.php';

Slim\Slim::registerAutoloader();

$app = new Slim\Slim();

//Get All friends end point
$app->get('/friends', function() {
  $db = new dbHandler();
  $cur = $db->getAllFriends();
  //Variable to store result
  $result = array();

  //Do itteration for all document in a collection
  foreach ($cur as $doc) {
    $tmp = array();
    //Set key and get value from document and store to temporary array
    $tmp["name"] = $doc["name"];
    $tmp["age"] = $doc["age"];
    //push temporary array to $result
    array_push($result,$tmp);
  }
  //show result
  response(200, $result);
});

$RequireAuth = function (Request $request, RequestHandler $handler) {
  $response = $handler->handle($request);
  $response->getBody()->write('World');

  return $response;
};

$app->post('/api/tags/',function()use($app){
  // $user = res.locals.user;
  $user_id;

  $db = new dbHandler();

  $problemId = $app->request()->post('problemId');
  $tagName = $app->request()->post('tagName');

  try {
    $foundActualTag = $db->tags->findOne([ 'tag'=> $tagName ]);

    $updateUserTags = null;

    if (!$foundActualTag) {
      // Add tag to user model
      $updateUserTags = $db->users->findOneAndUpdate(
        [ '_id'=> $user_id ],
        [
          '$addToSet'=> [
            'tags'=> $tagName,
          ]
        ]
      );
    }

    $problemTags = $db->problems->findById($problemId, [ '_id'=> 0, 'tags'=> 1 ]);

    $updateProblem = $db->problems->findOneAndUpdate(
      [ '_id'=> $problemId, "userDefinedTags.user_id"=> [ '$eq'=> $user_id ] ],
      [
        '$addToSet'=> [
          "userDefinedTags.$.tags"=> $tagName,
        ],
      ]
    );

    if ($updateProblem == null) {
      $tagArr=$problemTags->tags;
      $tagArr->push($tagName);

      $updateProblem = $db->problems->findByIdAndUpdate(
        $problemId,
        [
          '$push'=> [
            'userDefinedTags'=> [
              'user_id'=> $user_id,
              'tags'=> $tagArr,
            ],
          ],
        ],
        [ 'userDefinedTags'=> 1, '_id'=> 0 ]
      );
    }

    $updateProblem = $db->problems->findOne(
      [ '_id'=> $problemId, "userDefinedTags.user_id"=> [ '$eq'=> $user_id ] ],
      [ '_id'=> 0, 'userDefinedTags'=> 1 ]
    );

    response(200,[
      $updateUserTags,
      $updateProblem,
    ]);
  } catch (MongoCursorException $err) {
    response(400);
  }
})->add($RequireAuth);

$app->post('/api/tags/search_tag',function()use($app){
  $value = $app->request()->post('value');
  $user_id = $app->request()->post('user_id');
  $db = new dbHandler();

  try {
      $data = $db->tags.find(
        [
          'tag'=> [ '$regex'=> $value, '$options'=> "i" ],
        ],
        [
          '_id'=> 0,
          'tag'=> 1,
        ]
      ).limit(10);
    

    if ($user_id != null) {
        $userData = $db->users->aggregate([
          [ '$unwind'=> [ 'path'=> "tags" ] ],
          [
            '$match'=> [ 
              '$and'=> [[ '_id'=> $user_id ], [ 'tags'=> [ '$regex'=> $value ]]],
          ],
          ],
          [ '$group'=> [ '_id'=> [ 'tags'=>"tags" ]] ],
        ]).limit(10);
      
    }

    return response(200,[ $data, $userData ]);
  } catch (MongoCursorException $error) {
    return respnse(500);
  }
});

$app->get('/api/tags/tags/{tagType}/{offset}',function()use($app){
  $tagType = $app->getArgument('tagType');
  $offset = $app->getArgument('offset')*10;
  $db = new dbHandler();

  try {
    $resp =  $db->tag->find([ 'type'=> $tagType ], [ 'tag'=> 1, '_id'=> 0 ])
      // .sort([ 'count'=> -1 ])
      .limit(10)
      .skip($offset);

    if ($resp) {
      response(400,[
        $data=> "No tags found",
      ]);
    } else {
      response(200,$resp);
    }
  } catch (MongoCursorException $err) {
    response(400);
  }
});

$app->post('/api/problem/{offset}', function() use($app){
  $offset = $app->getArgument('offset') * 20;
  $user_id = $app->request()->post('user_id');
  $tags = $app->request()->post('tags');

  $db = new dbHandler();

  if ($user_id === null) {
    try {
      $questions = $db->problems->find(
        [
          'tags'=> [ '$all'=> $tags ],
        ],
        [ 'userDefinedTags'=> 0 ]
      )
        .limit(20)
        .skip($offset);
      response(200,$questions);
    } catch (MongoCursorException $err) {
      response(400,$err);
    }
  } else {
    try {
      $questions = $db->problems->find([
        '$or'=> [
          [ 'tags'=> [ '$all'=> $tags] ],
          [
            '$and'=> [
              [ "userDefinedTags.tags"=> [ '$all'=> $tags ] ],
              [ "userDefinedTags.user_id"=> ($user_id) ],
            ],
        ],
        ],
      ])
        .limit(20)
        .skip($offset);
      response(200,$questions);
    } catch (MongoCursorException $err) {
      response(500,[ $err=> "Error fetching problems" ]);
    }
  }
});

$app->post('/api/problem/problem/{problemId}', function() use($app){
  $res = array();
  $problemId = $app->getArgument('problemId');
  $name = $app->request()->post('name');
  $age = $app->request()->post('age');

  $db = new dbHandler();
  $cur = $db->insertFriend($name,$age);

  $user_id  =$app->request().post('name');

  if ($user_id === null) {
    $tagsObj = $db->problems->findOne(
      [ '_id' => $problemId ],
      [ '_id'=> 0, 'tags'=> 1 ]
    );

    response(200,[ 'tags'=> $tagsObj->tags ]);
  } else {

      $tagsObj = $db->problems.findOne(
        [
          '_id'=> $problemId,
          "userDefinedTags->user_id"=> [ '$eq'=> $user_id ],
        ],
        [ "userDefinedTags.$"=> 1, '_id'=> 0 ]
      );

      if ($tagsObj) {
       response(200, ['tags'=> $tagsObj->userDefinedTags[0]->tags ]);
      } else {
        $tagsObj = $db->problems.findOne(
          [ '_id'=> $problemId] ,
          [ '_id'=> 0, 'tags'=> 1 ]
        );
        response(200,[ 'tags'=> $tagsObj->tags ]);
      }}
});

//rest response helper
function response($status, $response) {
  $app = \Slim\Slim::getInstance();
  //Set http response code
  $app->status($status);
  //Set content type
  $app->contentType('application/json');
  //Encode result as json
  echo json_encode($response, JSON_PRETTY_PRINT);

}

//run application
$app->run();
?>
