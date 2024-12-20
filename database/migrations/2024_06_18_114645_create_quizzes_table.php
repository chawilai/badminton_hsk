<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained('lessons')->onDelete('cascade');
            $table->timestamps();
        });

    }

    public function down()
    {
        Schema::dropIfExists('quizzes');
    }
};

// "บทที่":"ชื่อภาษาจีน":"ชื่อภาษาอังกฤษ":"เนื้อหาโดยสรุป"
// "1":"你好":"Hello":"การทักทายและแนะนำตัวเบื้องต้น"
// "2":"谢谢":"Thank you":"การแสดงความขอบคุณและตอบรับคำขอบคุณ"
// "3":"你叫什么名字？":"What's your name?":"การถามและตอบชื่อ"
// "4":"她是我的汉语老师":"She is my Chinese teacher":"การแนะนำบุคคลและอาชีพ"
// "5":"她的女儿今年20岁":"Her daughter is 20 years old this year":"การพูดถึงอายุและบุคคลในครอบครัว"
// "6":"我会说汉语":"I can speak Chinese":"การพูดถึงความสามารถในการใช้ภาษา"
// "7":"今天几号？":"What's the date today?":"การถามและตอบวันที่ในปัจจุบัน"
// "8":"我想要茶":"I'd like some tea":"การสั่งอาหารหรือเครื่องดื่มในร้าน"
// "9":"你儿子在哪里工作？":"Where does your son work?":"การถามและตอบเกี่ยวกับสถานที่ทำงาน"
// "10":"我可以坐这里吗？":"Can I sit here?	การขออนุญาตและการตอบรับในสถานการณ์ต่าง":"ๆ"
// "11":"现在几点？":"What's the time now?":"การถามและตอบเวลา"
// "12":"明天天气怎么样？":"What will the weather be like tomorrow?":"การพูดถึงสภาพอากาศในวันถัดไป"
// "13":"他在学做中国菜":"He is learning to cook Chinese food	การพูดถึงการเรียนรู้ทักษะใหม่":"ๆ"
// "14":"她买了不少衣服":"She has bought quite a few clothes":"การพูดถึงการช้อปปิ้งและสิ่งของที่ซื้อ"
// "15":"我是坐飞机来的":"I came here by air":"การพูดถึงการเดินทางและพาหนะที่ใช้"
