/**
 * Created by HB02 on 2016-02-03.
 */
// binding task model
var Task = require('../model/task.js');

// define list() to get all tasks and display

exports.list = function (req,res) {
    // find tasks
    Task.find(function (err,tasks) {
        console.log('모든 업무를 가져오는데 성공함 {'+tasks+'}');

        var todoTasks = [];
        var inProgressTasks = [];
        var doneTasks = [];

        //make task list for each status

        for(var key in tasks){
            var task = tasks[key];
            if(task.get('status') === 'TO-DO'){
                todoTasks.push(task.get('contents'));
            }else if(task.get('status')==='In-Progress'){
                inProgressTasks.push(task.get('contents'));
            }else if(task.get('status')==='Done'){
                doneTasks.push(task.get('contents'));
            }else{
                console.error('Task status is not valid.'+task);
            }
        }

        // rendering to main page with each task list

        res.render('index',{
            title : '나의 칸반보드',
            todoTasks : todoTasks,
            inProgressTasks : inProgressTasks,
            doneTasks : doneTasks
        });
    });
};

exports.create = function (req,res) {
    // check same task is exist or not, if exist, just skip..
    Task.find({contents : req.body.contents}, function (err,tasks) {
        if(err)throw err;
        var newTask = true;

        // check same task is exist
        if(tasks.length > 0){
            console.error('이미 존재하는 업무입니다.'+req.body.contents);
            newTask = false;
        }
        // if this is new, save it
        if(newTask){
            new Task({
                contents : req.body.contents,
                author : req.body.author
            }).save();

            console.log('새업무 등록 성공 {'+req.body.contents+'}');
        }
    });
    // display all tasks
    res.redirect('/');
    res.end();
};

exports.update = function (req,res) {
    // update tasks with new status
    Task.update({contents : req.body.contents
    },{status : req.body.status},
        function (err,numberAffected,raw) {
            if(err) throw err;
            console.log('수정된 업무는 %d',numberAffected);
            console.log('몽고DB에서 답변은 ',raw);
        });

    // display all tasks
    res.redirect('/');
    res.end();
};
exports.remove = function (req,res) {
    // remove  tasks
    Task.remove({
        contents : req.body.contents
    }, function (err) {
        if(err)throw err;
        console.log('업무 삭제 성공..콘텐츠는 {'+req.body.contents+'}');
    });
    // display all tasks
    res.redirect('/');
    res.end();
};