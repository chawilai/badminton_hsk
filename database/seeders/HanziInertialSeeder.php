<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HanziInertialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Categories
        DB::table('categories')->insert([
            ['title_thai' => 'อักษร HSK 1', 'title_english' => 'HSK 1'],
            ['title_thai' => 'อักษร HSK 2', 'title_english' => 'HSK 2'],
            ['title_thai' => 'อักษร HSK 3', 'title_english' => 'HSK 3'],
            ['title_thai' => 'อักษร HSK 4', 'title_english' => 'HSK 4'],
            ['title_thai' => 'อักษร HSK 5', 'title_english' => 'HSK 5'],
            ['title_thai' => 'อักษร HSK 6', 'title_english' => 'HSK 6'],
            ['title_thai' => 'อักษร ใช้บ่อย', 'title_english' => 'Frequently Used Hanzi'],
            ['title_thai' => 'อักษร สามัญ', 'title_english' => 'Common Hanzi'],
            ['title_thai' => 'อักษร ดั่งเดิม', 'title_english' => 'Traditional Hanzi'],
            ['title_thai' => 'อักษร ไม่สามัญ', 'title_english' => 'Uncommon Hanzi'],
        ]);

        // Parts of Speech
        DB::table('parts_of_speech')->insert([
            ['title_thai' => 'Noun', 'abbreviation_thai' => 'n.', 'meaning_thai' => 'A word that names a person, place, thing, or idea.', 'title_english' => 'Noun', 'abbreviation_english' => 'n.', 'meaning_english' => 'A word that names a person, place, thing, or idea.'],
            ['title_thai' => 'Pronoun', 'abbreviation_thai' => 'pron.', 'meaning_thai' => 'A word that takes the place of a noun.', 'title_english' => 'Pronoun', 'abbreviation_english' => 'pron.', 'meaning_english' => 'A word that takes the place of a noun.'],
            ['title_thai' => 'Verb', 'abbreviation_thai' => 'v.', 'meaning_thai' => 'A word that expresses an action or state of being.', 'title_english' => 'Verb', 'abbreviation_english' => 'v.', 'meaning_english' => 'A word that expresses an action or state of being.'],
            ['title_thai' => 'Adjective', 'abbreviation_thai' => 'adj.', 'meaning_thai' => 'A word that modifies a noun or pronoun.', 'title_english' => 'Adjective', 'abbreviation_english' => 'adj.', 'meaning_english' => 'A word that modifies a noun or pronoun.'],
            ['title_thai' => 'Adverb', 'abbreviation_thai' => 'adv.', 'meaning_thai' => 'A word that modifies a verb, adjective, or another adverb.', 'title_english' => 'Adverb', 'abbreviation_english' => 'adv.', 'meaning_english' => 'A word that modifies a verb, adjective, or another adverb.'],
            ['title_thai' => 'Preposition', 'abbreviation_thai' => 'prep.', 'meaning_thai' => 'A word that shows the relationship between a noun or pronoun and other words in the sentence.', 'title_english' => 'Preposition', 'abbreviation_english' => 'prep.', 'meaning_english' => 'A word that shows the relationship between a noun or pronoun and other words in the sentence.'],
            ['title_thai' => 'Conjunction', 'abbreviation_thai' => 'conj.', 'meaning_thai' => 'A word that connects words, phrases, or clauses.', 'title_english' => 'Conjunction', 'abbreviation_english' => 'conj.', 'meaning_english' => 'A word that connects words, phrases, or clauses.'],
            ['title_thai' => 'Interjection', 'abbreviation_thai' => 'interj.', 'meaning_thai' => 'A word that expresses strong emotion and is often followed by an exclamation point.', 'title_english' => 'Interjection', 'abbreviation_english' => 'interj.', 'meaning_english' => 'A word that expresses strong emotion and is often followed by an exclamation point.'],
            ['title_thai' => 'Article', 'abbreviation_thai' => 'art.', 'meaning_thai' => 'A word used before a noun to indicate whether it refers to something specific (the) or something general (a, an). Sometimes included as a type of adjective.', 'title_english' => 'Article', 'abbreviation_english' => 'art.', 'meaning_english' => 'A word used before a noun to indicate whether it refers to something specific (the) or something general (a, an). Sometimes included as a type of adjective.'],
        ]);

        // Radical
        DB::table('radicals')->insert([
            ['radical' => '一', 'pinyin' => 'yī', 'pinyin_eng' => 'yi', 'meaning_thai' => 'หนึ่ง', 'description_thai' => null, 'meaning_english' => 'one', 'description_english' => null],
            ['radical' => '丨', 'pinyin' => 'gǔn', 'pinyin_eng' => 'gun', 'meaning_thai' => 'เส้น', 'description_thai' => null, 'meaning_english' => 'line', 'description_english' => null],
            ['radical' => '丶', 'pinyin' => 'zhǔ', 'pinyin_eng' => 'zhu', 'meaning_thai' => 'จุด', 'description_thai' => null, 'meaning_english' => 'dot', 'description_english' => null],
            ['radical' => '丿', 'pinyin' => 'piě', 'pinyin_eng' => 'pie', 'meaning_thai' => 'เส้นเฉียง', 'description_thai' => null, 'meaning_english' => 'slash', 'description_english' => null],
            ['radical' => '乛 (乙)', 'pinyin' => 'yǐ', 'pinyin_eng' => 'yi', 'meaning_thai' => 'ตะขอ', 'description_thai' => null, 'meaning_english' => 'second', 'description_english' => null],
            ['radical' => '亅', 'pinyin' => 'jué', 'pinyin_eng' => 'jue', 'meaning_thai' => 'ตะขอ', 'description_thai' => null, 'meaning_english' => 'hook', 'description_english' => null],
            ['radical' => '二', 'pinyin' => 'èr', 'pinyin_eng' => 'er', 'meaning_thai' => 'สอง', 'description_thai' => null, 'meaning_english' => 'two', 'description_english' => null],
            ['radical' => '亠', 'pinyin' => 'tóu', 'pinyin_eng' => 'tou', 'meaning_thai' => 'ฝาครอบ', 'description_thai' => null, 'meaning_english' => 'lid', 'description_english' => null],
            ['radical' => '人 (亻)', 'pinyin' => 'rén', 'pinyin_eng' => 'ren', 'meaning_thai' => 'คน', 'description_thai' => null, 'meaning_english' => 'person', 'description_english' => null],
            ['radical' => '儿', 'pinyin' => 'ér', 'pinyin_eng' => 'er', 'meaning_thai' => 'ขา', 'description_thai' => null, 'meaning_english' => 'son, legs', 'description_english' => null],
            ['radical' => '入', 'pinyin' => 'rù', 'pinyin_eng' => 'ru', 'meaning_thai' => 'เข้า', 'description_thai' => null, 'meaning_english' => 'enter', 'description_english' => null],
            ['radical' => '八 (丷)', 'pinyin' => 'bā', 'pinyin_eng' => 'ba', 'meaning_thai' => 'แปด', 'description_thai' => null, 'meaning_english' => 'eight', 'description_english' => null],
            ['radical' => '冂', 'pinyin' => 'jiōng', 'pinyin_eng' => 'jiong', 'meaning_thai' => 'เส้นปิด', 'description_thai' => null, 'meaning_english' => 'down box', 'description_english' => null],
            ['radical' => '冖', 'pinyin' => 'mì', 'pinyin_eng' => 'mi', 'meaning_thai' => 'ผ้าคลุม', 'description_thai' => null, 'meaning_english' => 'cover', 'description_english' => null],
            ['radical' => '冫', 'pinyin' => 'bīng', 'pinyin_eng' => 'bing', 'meaning_thai' => 'น้ำแข็ง', 'description_thai' => null, 'meaning_english' => 'ice', 'description_english' => null],
            ['radical' => '几', 'pinyin' => 'jī', 'pinyin_eng' => 'ji', 'meaning_thai' => 'โต๊ะเล็ก', 'description_thai' => null, 'meaning_english' => 'table', 'description_english' => null],
            ['radical' => '凵', 'pinyin' => 'kǎn', 'pinyin_eng' => 'kan', 'meaning_thai' => 'เปิดปาก', 'description_thai' => null, 'meaning_english' => 'open box', 'description_english' => null],
            ['radical' => '刀 (刂)', 'pinyin' => 'dāo', 'pinyin_eng' => 'dao', 'meaning_thai' => 'มีด', 'description_thai' => null, 'meaning_english' => 'knife', 'description_english' => null],
            ['radical' => '力', 'pinyin' => 'lì', 'pinyin_eng' => 'li', 'meaning_thai' => 'แรง', 'description_thai' => null, 'meaning_english' => 'power', 'description_english' => null],
            ['radical' => '勹', 'pinyin' => 'bāo', 'pinyin_eng' => 'bao', 'meaning_thai' => 'กอด', 'description_thai' => null, 'meaning_english' => 'wrap', 'description_english' => null],
            ['radical' => '匕', 'pinyin' => 'bǐ', 'pinyin_eng' => 'bi', 'meaning_thai' => 'ช้อน', 'description_thai' => null, 'meaning_english' => 'spoon', 'description_english' => null],
            ['radical' => '匚', 'pinyin' => 'fāng', 'pinyin_eng' => 'fang', 'meaning_thai' => 'กล่องปิด', 'description_thai' => null, 'meaning_english' => 'box', 'description_english' => null],
            ['radical' => '匸', 'pinyin' => 'xǐ', 'pinyin_eng' => 'xi', 'meaning_thai' => 'ซ่อน', 'description_thai' => null, 'meaning_english' => 'hiding enclosure', 'description_english' => null],
            ['radical' => '十', 'pinyin' => 'shí', 'pinyin_eng' => 'shi', 'meaning_thai' => 'สิบ', 'description_thai' => null, 'meaning_english' => 'ten', 'description_english' => null],
            ['radical' => '卜', 'pinyin' => 'bǔ', 'pinyin_eng' => 'bu', 'meaning_thai' => 'ทำนาย', 'description_thai' => null, 'meaning_english' => 'divination', 'description_english' => null],
            ['radical' => '卩', 'pinyin' => 'jié', 'pinyin_eng' => 'jie', 'meaning_thai' => 'ตรา', 'description_thai' => null, 'meaning_english' => 'seal', 'description_english' => null],
            ['radical' => '厂', 'pinyin' => 'hàn', 'pinyin_eng' => 'han', 'meaning_thai' => 'หน้าผา', 'description_thai' => null, 'meaning_english' => 'cliff', 'description_english' => null],
            ['radical' => '厶', 'pinyin' => 'sī', 'pinyin_eng' => 'si', 'meaning_thai' => 'ส่วนตัว', 'description_thai' => null, 'meaning_english' => 'private', 'description_english' => null],
            ['radical' => '又', 'pinyin' => 'yòu', 'pinyin_eng' => 'you', 'meaning_thai' => 'มืออีกข้าง', 'description_thai' => null, 'meaning_english' => 'again', 'description_english' => null],
            ['radical' => '口', 'pinyin' => 'kǒu', 'pinyin_eng' => 'kou', 'meaning_thai' => 'ปาก', 'description_thai' => null, 'meaning_english' => 'mouth', 'description_english' => null],
            ['radical' => '囗', 'pinyin' => 'wéi', 'pinyin_eng' => 'wei', 'meaning_thai' => 'ล้อม', 'description_thai' => null, 'meaning_english' => 'enclosure', 'description_english' => null],
            ['radical' => '土', 'pinyin' => 'tǔ', 'pinyin_eng' => 'tu', 'meaning_thai' => 'ดิน', 'description_thai' => null, 'meaning_english' => 'earth', 'description_english' => null],
            ['radical' => '士', 'pinyin' => 'shì', 'pinyin_eng' => 'shi', 'meaning_thai' => 'นักรบ', 'description_thai' => null, 'meaning_english' => 'scholar, knight', 'description_english' => null],
            ['radical' => '夂', 'pinyin' => 'zhǐ', 'pinyin_eng' => 'zhi', 'meaning_thai' => 'เดิน', 'description_thai' => null, 'meaning_english' => 'go', 'description_english' => null],
            ['radical' => '夊', 'pinyin' => 'suī', 'pinyin_eng' => 'sui', 'meaning_thai' => 'เดินช้า', 'description_thai' => null, 'meaning_english' => 'go slowly', 'description_english' => null],
            ['radical' => '夕', 'pinyin' => 'xī', 'pinyin_eng' => 'xi', 'meaning_thai' => 'เย็น', 'description_thai' => null, 'meaning_english' => 'evening', 'description_english' => null],
            ['radical' => '大', 'pinyin' => 'dà', 'pinyin_eng' => 'da', 'meaning_thai' => 'ใหญ่', 'description_thai' => null, 'meaning_english' => 'big', 'description_english' => null],
            ['radical' => '女', 'pinyin' => 'nǚ', 'pinyin_eng' => 'nu', 'meaning_thai' => 'ผู้หญิง', 'description_thai' => null, 'meaning_english' => 'woman', 'description_english' => null],
            ['radical' => '子', 'pinyin' => 'zǐ', 'pinyin_eng' => 'zi', 'meaning_thai' => 'ลูกชาย', 'description_thai' => null, 'meaning_english' => 'child', 'description_english' => null],
            ['radical' => '宀', 'pinyin' => 'mián', 'pinyin_eng' => 'mian', 'meaning_thai' => 'หลังคา', 'description_thai' => null, 'meaning_english' => 'roof', 'description_english' => null],
            ['radical' => '寸', 'pinyin' => 'cùn', 'pinyin_eng' => 'cun', 'meaning_thai' => 'นิ้ว', 'description_thai' => null, 'meaning_english' => 'inch', 'description_english' => null],
            ['radical' => '小 (⺌, ⺍)', 'pinyin' => 'xiǎo', 'pinyin_eng' => 'xiao', 'meaning_thai' => 'เล็ก', 'description_thai' => null, 'meaning_english' => 'small', 'description_english' => null],
            ['radical' => '尢 (尣)', 'pinyin' => 'wāng', 'pinyin_eng' => 'wang', 'meaning_thai' => 'ขาพิการ', 'description_thai' => null, 'meaning_english' => 'lame', 'description_english' => null],
            ['radical' => '尸', 'pinyin' => 'shī', 'pinyin_eng' => 'shi', 'meaning_thai' => 'ศพ', 'description_thai' => null, 'meaning_english' => 'corpse', 'description_english' => null],
            ['radical' => '屮', 'pinyin' => 'chè', 'pinyin_eng' => 'che', 'meaning_thai' => 'หน่อ', 'description_thai' => null, 'meaning_english' => 'sprout', 'description_english' => null],
            ['radical' => '山', 'pinyin' => 'shān', 'pinyin_eng' => 'shan', 'meaning_thai' => 'ภูเขา', 'description_thai' => null, 'meaning_english' => 'mountain', 'description_english' => null],
            ['radical' => '巛 (川, 巜)', 'pinyin' => 'chuān', 'pinyin_eng' => 'chuan', 'meaning_thai' => 'แม่น้ำ', 'description_thai' => null, 'meaning_english' => 'river', 'description_english' => null],
            ['radical' => '工', 'pinyin' => 'gōng', 'pinyin_eng' => 'gong', 'meaning_thai' => 'งาน', 'description_thai' => null, 'meaning_english' => 'work', 'description_english' => null],
            ['radical' => '己', 'pinyin' => 'jǐ', 'pinyin_eng' => 'ji', 'meaning_thai' => 'ตัวเอง', 'description_thai' => null, 'meaning_english' => 'oneself', 'description_english' => null],
            ['radical' => '巾', 'pinyin' => 'jīn', 'pinyin_eng' => 'jin', 'meaning_thai' => 'ผ้า', 'description_thai' => null, 'meaning_english' => 'turban, scarf', 'description_english' => null],
            ['radical' => '干', 'pinyin' => 'gān', 'pinyin_eng' => 'gan', 'meaning_thai' => 'แห้ง', 'description_thai' => null, 'meaning_english' => 'dry', 'description_english' => null],
            ['radical' => '幺', 'pinyin' => 'yāo', 'pinyin_eng' => 'yao', 'meaning_thai' => 'เล็ก', 'description_thai' => null, 'meaning_english' => 'short, tiny', 'description_english' => null],
            ['radical' => '广', 'pinyin' => 'guǎng', 'pinyin_eng' => 'guang', 'meaning_thai' => 'ที่พัก', 'description_thai' => null, 'meaning_english' => 'shelter', 'description_english' => null],
            ['radical' => '廴', 'pinyin' => 'yǐn', 'pinyin_eng' => 'yin', 'meaning_thai' => 'เดิน', 'description_thai' => null, 'meaning_english' => 'stride', 'description_english' => null],
            ['radical' => '廾', 'pinyin' => 'gǒng', 'pinyin_eng' => 'gong', 'meaning_thai' => 'สองมือ', 'description_thai' => null, 'meaning_english' => 'two hands', 'description_english' => null],
            ['radical' => '弋', 'pinyin' => 'yì', 'pinyin_eng' => 'yi', 'meaning_thai' => 'ลูกศร', 'description_thai' => null, 'meaning_english' => 'shoot, arrow', 'description_english' => null],
            ['radical' => '弓', 'pinyin' => 'gōng', 'pinyin_eng' => 'gong', 'meaning_thai' => 'คันธนู', 'description_thai' => null, 'meaning_english' => 'bow', 'description_english' => null],
            ['radical' => '彐 (彑)', 'pinyin' => 'jì', 'pinyin_eng' => 'ji', 'meaning_thai' => 'หัวหมู', 'description_thai' => null, 'meaning_english' => 'pig snout', 'description_english' => null],
            ['radical' => '彡', 'pinyin' => 'shān', 'pinyin_eng' => 'shan', 'meaning_thai' => 'เส้นผม', 'description_thai' => null, 'meaning_english' => 'bristle', 'description_english' => null],
            ['radical' => '彳', 'pinyin' => 'chì', 'pinyin_eng' => 'chi', 'meaning_thai' => 'สองคน', 'description_thai' => null, 'meaning_english' => 'step', 'description_english' => null],
            ['radical' => '心 (忄, ⺗)', 'pinyin' => 'xīn', 'pinyin_eng' => 'xin', 'meaning_thai' => 'หัวใจ', 'description_thai' => null, 'meaning_english' => 'heart', 'description_english' => null],
            ['radical' => '戈', 'pinyin' => 'gē', 'pinyin_eng' => 'ge', 'meaning_thai' => 'หอก', 'description_thai' => null, 'meaning_english' => 'halberd', 'description_english' => null],
            ['radical' => '户 (戶)', 'pinyin' => 'hù', 'pinyin_eng' => 'hu', 'meaning_thai' => 'ประตู', 'description_thai' => null, 'meaning_english' => 'door', 'description_english' => null],
            ['radical' => '手 (扌, 龵)', 'pinyin' => 'shǒu', 'pinyin_eng' => 'shou', 'meaning_thai' => 'มือ', 'description_thai' => null, 'meaning_english' => 'hand', 'description_english' => null],
            ['radical' => '支', 'pinyin' => 'zhī', 'pinyin_eng' => 'zhi', 'meaning_thai' => 'กิ่ง', 'description_thai' => null, 'meaning_english' => 'branch', 'description_english' => null],
            ['radical' => '攴 (攵)', 'pinyin' => 'pū', 'pinyin_eng' => 'pu', 'meaning_thai' => 'ตี', 'description_thai' => null, 'meaning_english' => 'rap', 'description_english' => null],
            ['radical' => '文', 'pinyin' => 'wén', 'pinyin_eng' => 'wen', 'meaning_thai' => 'วัฒนธรรม', 'description_thai' => null, 'meaning_english' => 'culture', 'description_english' => null],
            ['radical' => '斗', 'pinyin' => 'dǒu', 'pinyin_eng' => 'dou', 'meaning_thai' => 'ตวงข้าว', 'description_thai' => null, 'meaning_english' => 'dipper', 'description_english' => null],
            ['radical' => '斤', 'pinyin' => 'jīn', 'pinyin_eng' => 'jin', 'meaning_thai' => 'ขวาน', 'description_thai' => null, 'meaning_english' => 'axe', 'description_english' => null],
            ['radical' => '方', 'pinyin' => 'fāng', 'pinyin_eng' => 'fang', 'meaning_thai' => 'ทิศทาง', 'description_thai' => null, 'meaning_english' => 'square', 'description_english' => null],
            ['radical' => '无 (旡)', 'pinyin' => 'wú', 'pinyin_eng' => 'wu', 'meaning_thai' => 'ไม่มี', 'description_thai' => null, 'meaning_english' => 'not', 'description_english' => null],
            ['radical' => '日', 'pinyin' => 'rì', 'pinyin_eng' => 'ri', 'meaning_thai' => 'ดวงอาทิตย์', 'description_thai' => null, 'meaning_english' => 'sun', 'description_english' => null],
            ['radical' => '曰', 'pinyin' => 'yuē', 'pinyin_eng' => 'yue', 'meaning_thai' => 'กล่าว', 'description_thai' => null, 'meaning_english' => 'say', 'description_english' => null],
            ['radical' => '月', 'pinyin' => 'yuè', 'pinyin_eng' => 'yue', 'meaning_thai' => 'ดวงจันทร์', 'description_thai' => null, 'meaning_english' => 'moon', 'description_english' => null],
            ['radical' => '木', 'pinyin' => 'mù', 'pinyin_eng' => 'mu', 'meaning_thai' => 'ไม้', 'description_thai' => null, 'meaning_english' => 'wood', 'description_english' => null],
            ['radical' => '欠', 'pinyin' => 'qiàn', 'pinyin_eng' => 'qian', 'meaning_thai' => 'ขาด', 'description_thai' => null, 'meaning_english' => 'lack', 'description_english' => null],
            ['radical' => '止', 'pinyin' => 'zhǐ', 'pinyin_eng' => 'zhi', 'meaning_thai' => 'หยุด', 'description_thai' => null, 'meaning_english' => 'stop', 'description_english' => null],
            ['radical' => '歹 (歺)', 'pinyin' => 'dǎi', 'pinyin_eng' => 'dai', 'meaning_thai' => 'ซากศพ', 'description_thai' => null, 'meaning_english' => 'death', 'description_english' => null],
            ['radical' => '殳', 'pinyin' => 'shū', 'pinyin_eng' => 'shu', 'meaning_thai' => 'อาวุธ', 'description_thai' => null, 'meaning_english' => 'weapon', 'description_english' => null],
            ['radical' => '毋 (母, ⺟)', 'pinyin' => 'wú, mǔ', 'pinyin_eng' => 'wu', 'meaning_thai' => 'แม่', 'description_thai' => null, 'meaning_english' => 'mother', 'description_english' => null],
            ['radical' => '比', 'pinyin' => 'bǐ', 'pinyin_eng' => 'mu', 'meaning_thai' => 'เปรียบเทียบ', 'description_thai' => null, 'meaning_english' => 'compare', 'description_english' => null],
            ['radical' => '毛', 'pinyin' => 'máo', 'pinyin_eng' => 'bi', 'meaning_thai' => 'ขน', 'description_thai' => null, 'meaning_english' => 'fur', 'description_english' => null],
            ['radical' => '氏', 'pinyin' => 'shì', 'pinyin_eng' => 'mao', 'meaning_thai' => 'ตระกูล', 'description_thai' => null, 'meaning_english' => 'clan', 'description_english' => null],
            ['radical' => '气', 'pinyin' => 'qì', 'pinyin_eng' => 'shi', 'meaning_thai' => 'อากาศ', 'description_thai' => null, 'meaning_english' => 'air', 'description_english' => null],
            ['radical' => '水 (氵,氺)', 'pinyin' => 'shuǐ', 'pinyin_eng' => 'qi', 'meaning_thai' => 'น้ำ', 'description_thai' => null, 'meaning_english' => 'water', 'description_english' => null],
            ['radical' => '火 (灬)', 'pinyin' => 'huǒ', 'pinyin_eng' => 'shui', 'meaning_thai' => 'ไฟ', 'description_thai' => null, 'meaning_english' => 'fire', 'description_english' => null],
            ['radical' => '爪 (爫)', 'pinyin' => 'zhǎo', 'pinyin_eng' => 'huo', 'meaning_thai' => 'เล็บ', 'description_thai' => null, 'meaning_english' => 'claw', 'description_english' => null],
            ['radical' => '父', 'pinyin' => 'fù', 'pinyin_eng' => 'zhao', 'meaning_thai' => 'พ่อ', 'description_thai' => null, 'meaning_english' => 'father', 'description_english' => null],
            ['radical' => '爻', 'pinyin' => 'yáo', 'pinyin_eng' => 'fu', 'meaning_thai' => 'ลวดลาย', 'description_thai' => null, 'meaning_english' => 'double x', 'description_english' => null],
            ['radical' => '爿', 'pinyin' => 'qiáng', 'pinyin_eng' => 'yao', 'meaning_thai' => 'ผ่าซีก', 'description_thai' => null, 'meaning_english' => 'half of a tree trunk', 'description_english' => null],
            ['radical' => '片', 'pinyin' => 'piàn', 'pinyin_eng' => 'qiang', 'meaning_thai' => 'ชิ้น', 'description_thai' => null, 'meaning_english' => 'slice', 'description_english' => null],
            ['radical' => '牙', 'pinyin' => 'yá', 'pinyin_eng' => 'pian', 'meaning_thai' => 'ฟัน', 'description_thai' => null, 'meaning_english' => 'tooth', 'description_english' => null],
            ['radical' => '牛 (牜, ⺧)', 'pinyin' => 'niú', 'pinyin_eng' => 'ya', 'meaning_thai' => 'วัว', 'description_thai' => null, 'meaning_english' => 'cow', 'description_english' => null],
            ['radical' => '犬 (犭)', 'pinyin' => 'quǎn', 'pinyin_eng' => 'niu', 'meaning_thai' => 'สุนัข', 'description_thai' => null, 'meaning_english' => 'dog', 'description_english' => null],
            ['radical' => '玄', 'pinyin' => 'xuán', 'pinyin_eng' => 'quan', 'meaning_thai' => 'ลึกซึ้ง', 'description_thai' => null, 'meaning_english' => 'profound', 'description_english' => null],
            ['radical' => '玉 (⺩,王)', 'pinyin' => 'yù', 'pinyin_eng' => 'xuan', 'meaning_thai' => 'หยก', 'description_thai' => null, 'meaning_english' => 'jade', 'description_english' => null],
            ['radical' => '瓜', 'pinyin' => 'guā', 'pinyin_eng' => 'yu', 'meaning_thai' => 'แตง', 'description_thai' => null, 'meaning_english' => 'melon', 'description_english' => null],
            ['radical' => '瓦', 'pinyin' => 'wǎ', 'pinyin_eng' => 'gua', 'meaning_thai' => 'กระเบื้อง', 'description_thai' => null, 'meaning_english' => 'tile', 'description_english' => null],
            ['radical' => '甘', 'pinyin' => 'gān', 'pinyin_eng' => 'wa', 'meaning_thai' => 'หวาน', 'description_thai' => null, 'meaning_english' => 'sweet', 'description_english' => null],
            ['radical' => '生', 'pinyin' => 'shēng', 'pinyin_eng' => 'gan', 'meaning_thai' => 'เกิด', 'description_thai' => null, 'meaning_english' => 'life, birth', 'description_english' => null],
            ['radical' => '用 (甩)', 'pinyin' => 'yòng', 'pinyin_eng' => 'sheng', 'meaning_thai' => 'ใช้', 'description_thai' => null, 'meaning_english' => 'use', 'description_english' => null],
            ['radical' => '田', 'pinyin' => 'tián', 'pinyin_eng' => 'yong', 'meaning_thai' => 'นา', 'description_thai' => null, 'meaning_english' => 'field', 'description_english' => null],
            ['radical' => '疋 (⺪)', 'pinyin' => 'pǐ', 'pinyin_eng' => 'tian', 'meaning_thai' => 'ขา, หน่วยผ้า', 'description_thai' => null, 'meaning_english' => 'bolt of cloth', 'description_english' => null],
            ['radical' => '疒', 'pinyin' => 'chuáng', 'pinyin_eng' => 'pi', 'meaning_thai' => 'ป่วย', 'description_thai' => null, 'meaning_english' => 'sickness', 'description_english' => null],
            ['radical' => '癶', 'pinyin' => 'bō', 'pinyin_eng' => 'chuang', 'meaning_thai' => 'ก้าว', 'description_thai' => null, 'meaning_english' => 'footsteps', 'description_english' => null],
            ['radical' => '白', 'pinyin' => 'bái', 'pinyin_eng' => 'bo', 'meaning_thai' => 'ขาว', 'description_thai' => null, 'meaning_english' => 'white', 'description_english' => null],
            ['radical' => '皮', 'pinyin' => 'pí', 'pinyin_eng' => 'bai', 'meaning_thai' => 'หนัง', 'description_thai' => null, 'meaning_english' => 'skin', 'description_english' => null],
            ['radical' => '皿', 'pinyin' => 'mǐn', 'pinyin_eng' => 'pi', 'meaning_thai' => 'จาน', 'description_thai' => null, 'meaning_english' => 'dish', 'description_english' => null],
            ['radical' => '目', 'pinyin' => 'mù', 'pinyin_eng' => 'min', 'meaning_thai' => 'ตา', 'description_thai' => null, 'meaning_english' => 'eye', 'description_english' => null],
            ['radical' => '矛', 'pinyin' => 'máo', 'pinyin_eng' => 'mu', 'meaning_thai' => 'หอก', 'description_thai' => null, 'meaning_english' => 'spear', 'description_english' => null],
            ['radical' => '矢', 'pinyin' => 'shǐ', 'pinyin_eng' => 'mao', 'meaning_thai' => 'ลูกศร', 'description_thai' => null, 'meaning_english' => 'arrow', 'description_english' => null],
            ['radical' => '石', 'pinyin' => 'shí', 'pinyin_eng' => 'shi', 'meaning_thai' => 'หิน', 'description_thai' => null, 'meaning_english' => 'stone', 'description_english' => null],
            ['radical' => '示 (礻)', 'pinyin' => 'shì', 'pinyin_eng' => 'shi', 'meaning_thai' => 'แสดง', 'description_thai' => null, 'meaning_english' => 'spirit', 'description_english' => null],
            ['radical' => '禸', 'pinyin' => 'róu', 'pinyin_eng' => 'shi', 'meaning_thai' => 'รอยเท้า', 'description_thai' => null, 'meaning_english' => 'track', 'description_english' => null],
            ['radical' => '禾', 'pinyin' => 'hé', 'pinyin_eng' => 'rou', 'meaning_thai' => 'ข้าว', 'description_thai' => null, 'meaning_english' => 'grain', 'description_english' => null],
            ['radical' => '穴', 'pinyin' => 'xué', 'pinyin_eng' => 'he', 'meaning_thai' => 'รู', 'description_thai' => null, 'meaning_english' => 'cave', 'description_english' => null],
            ['radical' => '立', 'pinyin' => 'lì', 'pinyin_eng' => 'xue', 'meaning_thai' => 'ยืน', 'description_thai' => null, 'meaning_english' => 'stand', 'description_english' => null],
            ['radical' => '竹 (⺮)', 'pinyin' => 'zhú', 'pinyin_eng' => 'li', 'meaning_thai' => 'ไผ่', 'description_thai' => null, 'meaning_english' => 'bamboo', 'description_english' => null],
            ['radical' => '米', 'pinyin' => 'mǐ', 'pinyin_eng' => 'zhu', 'meaning_thai' => 'ข้าว', 'description_thai' => null, 'meaning_english' => 'rice', 'description_english' => null],
            ['radical' => '糸 (糹, 纟)', 'pinyin' => 'sī', 'pinyin_eng' => 'mi', 'meaning_thai' => 'เส้นไหม', 'description_thai' => null, 'meaning_english' => 'silk', 'description_english' => null],
            ['radical' => '缶', 'pinyin' => 'fǒu', 'pinyin_eng' => 'si', 'meaning_thai' => 'กระปุก', 'description_thai' => null, 'meaning_english' => 'jar', 'description_english' => null],
            ['radical' => '网 (罒,⺲,罓,⺳)', 'pinyin' => 'wǎng', 'pinyin_eng' => 'fou', 'meaning_thai' => 'ตาข่าย', 'description_thai' => null, 'meaning_english' => 'net', 'description_english' => null],
            ['radical' => '羊 (⺶,⺷)', 'pinyin' => 'yáng', 'pinyin_eng' => 'wang', 'meaning_thai' => 'แกะ', 'description_thai' => null, 'meaning_english' => 'sheep', 'description_english' => null],
            ['radical' => '羽', 'pinyin' => 'yǔ', 'pinyin_eng' => 'yang', 'meaning_thai' => 'ปีก', 'description_thai' => null, 'meaning_english' => 'feather', 'description_english' => null],
            ['radical' => '老 (耂)', 'pinyin' => 'lǎo', 'pinyin_eng' => 'yu', 'meaning_thai' => 'แก่', 'description_thai' => null, 'meaning_english' => 'old', 'description_english' => null],
            ['radical' => '而', 'pinyin' => 'ér', 'pinyin_eng' => 'lao', 'meaning_thai' => 'เครา', 'description_thai' => null, 'meaning_english' => 'and', 'description_english' => null],
            ['radical' => '耒', 'pinyin' => 'lěi', 'pinyin_eng' => 'er', 'meaning_thai' => 'คันไถ', 'description_thai' => null, 'meaning_english' => 'plow', 'description_english' => null],
            ['radical' => '耳', 'pinyin' => 'ěr', 'pinyin_eng' => 'lei', 'meaning_thai' => 'หู', 'description_thai' => null, 'meaning_english' => 'ear', 'description_english' => null],
            ['radical' => '聿 (⺻)', 'pinyin' => 'yù', 'pinyin_eng' => 'er', 'meaning_thai' => 'พู่กัน', 'description_thai' => null, 'meaning_english' => 'brush', 'description_english' => null],
            ['radical' => '肉 (⺼,月)', 'pinyin' => 'ròu', 'pinyin_eng' => 'yu', 'meaning_thai' => 'เนื้อ', 'description_thai' => null, 'meaning_english' => 'meat', 'description_english' => null],
            ['radical' => '臣', 'pinyin' => 'chén', 'pinyin_eng' => 'rou', 'meaning_thai' => 'ข้าราชการ', 'description_thai' => null, 'meaning_english' => 'minister', 'description_english' => null],
            ['radical' => '自', 'pinyin' => 'zì', 'pinyin_eng' => 'chen', 'meaning_thai' => 'ตัวเอง', 'description_thai' => null, 'meaning_english' => 'self', 'description_english' => null],
            ['radical' => '至', 'pinyin' => 'zhì', 'pinyin_eng' => 'zi', 'meaning_thai' => 'ถึง', 'description_thai' => null, 'meaning_english' => 'arrive', 'description_english' => null],
            ['radical' => '臼', 'pinyin' => 'jiù', 'pinyin_eng' => 'zhi', 'meaning_thai' => 'ครก', 'description_thai' => null, 'meaning_english' => 'mortar', 'description_english' => null],
            ['radical' => '舌', 'pinyin' => 'shé', 'pinyin_eng' => 'jiu', 'meaning_thai' => 'ลิ้น', 'description_thai' => null, 'meaning_english' => 'tongue', 'description_english' => null],
            ['radical' => '舛', 'pinyin' => 'chuǎn', 'pinyin_eng' => 'she', 'meaning_thai' => 'ผิดทาง', 'description_thai' => null, 'meaning_english' => 'contrary', 'description_english' => null],
            ['radical' => '舟', 'pinyin' => 'zhōu', 'pinyin_eng' => 'chuan', 'meaning_thai' => 'เรือ', 'description_thai' => null, 'meaning_english' => 'boat', 'description_english' => null],
            ['radical' => '艮', 'pinyin' => 'gèn', 'pinyin_eng' => 'zhou', 'meaning_thai' => 'แข็ง', 'description_thai' => null, 'meaning_english' => 'stopping', 'description_english' => null],
            ['radical' => '色', 'pinyin' => 'sè', 'pinyin_eng' => 'gen', 'meaning_thai' => 'สี', 'description_thai' => null, 'meaning_english' => 'color', 'description_english' => null],
            ['radical' => '艸 (艹,䒑)', 'pinyin' => 'cǎo', 'pinyin_eng' => 'se', 'meaning_thai' => 'หญ้า', 'description_thai' => null, 'meaning_english' => 'grass', 'description_english' => null],
            ['radical' => '虍', 'pinyin' => 'hū', 'pinyin_eng' => 'cao', 'meaning_thai' => 'เสือ', 'description_thai' => null, 'meaning_english' => 'tiger', 'description_english' => null],
            ['radical' => '虫', 'pinyin' => 'huǐ', 'pinyin_eng' => 'hu', 'meaning_thai' => 'แมลง', 'description_thai' => null, 'meaning_english' => 'insect', 'description_english' => null],
            ['radical' => '血', 'pinyin' => 'xuè', 'pinyin_eng' => 'hui', 'meaning_thai' => 'เลือด', 'description_thai' => null, 'meaning_english' => 'blood', 'description_english' => null],
            ['radical' => '行', 'pinyin' => 'xíng', 'pinyin_eng' => 'xue', 'meaning_thai' => 'เดิน', 'description_thai' => null, 'meaning_english' => 'walk', 'description_english' => null],
            ['radical' => '衣 (衤)', 'pinyin' => 'yī', 'pinyin_eng' => 'xing', 'meaning_thai' => 'เสื้อผ้า', 'description_thai' => null, 'meaning_english' => 'clothes', 'description_english' => null],
            ['radical' => '襾 (覀)', 'pinyin' => 'yà', 'pinyin_eng' => 'yi', 'meaning_thai' => 'ปิด', 'description_thai' => null, 'meaning_english' => 'west', 'description_english' => null],
            ['radical' => '见 (見)', 'pinyin' => 'jiàn', 'pinyin_eng' => 'ya', 'meaning_thai' => 'เห็น', 'description_thai' => null, 'meaning_english' => 'see', 'description_english' => null],
            ['radical' => '角', 'pinyin' => 'jiǎo', 'pinyin_eng' => 'jian', 'meaning_thai' => 'เขา', 'description_thai' => null, 'meaning_english' => 'horn', 'description_english' => null],
            ['radical' => '讠 (言,訁)', 'pinyin' => 'yán', 'pinyin_eng' => 'jiao', 'meaning_thai' => 'พูด', 'description_thai' => null, 'meaning_english' => 'speech', 'description_english' => null],
            ['radical' => '谷', 'pinyin' => 'gǔ', 'pinyin_eng' => 'yan', 'meaning_thai' => 'หุบเขา', 'description_thai' => null, 'meaning_english' => 'valley', 'description_english' => null],
            ['radical' => '豆', 'pinyin' => 'dòu', 'pinyin_eng' => 'gu', 'meaning_thai' => 'ถั่ว', 'description_thai' => null, 'meaning_english' => 'bean', 'description_english' => null],
            ['radical' => '豕', 'pinyin' => 'shǐ', 'pinyin_eng' => 'dou', 'meaning_thai' => 'หมู', 'description_thai' => null, 'meaning_english' => 'pig', 'description_english' => null],
            ['radical' => '豸', 'pinyin' => 'zhì', 'pinyin_eng' => 'shi', 'meaning_thai' => 'สัตว์', 'description_thai' => null, 'meaning_english' => 'badger', 'description_english' => null],
            ['radical' => '贝 (貝)', 'pinyin' => 'bèi', 'pinyin_eng' => 'zhi', 'meaning_thai' => 'เปลือกหอย', 'description_thai' => null, 'meaning_english' => 'shell', 'description_english' => null],
            ['radical' => '赤', 'pinyin' => 'chì', 'pinyin_eng' => 'bei', 'meaning_thai' => 'แดง', 'description_thai' => null, 'meaning_english' => 'red', 'description_english' => null],
            ['radical' => '走 (赱)', 'pinyin' => 'zǒu', 'pinyin_eng' => 'chi', 'meaning_thai' => 'เดิน', 'description_thai' => null, 'meaning_english' => 'run', 'description_english' => null],
            ['radical' => '足 (⻊)', 'pinyin' => 'zú', 'pinyin_eng' => 'zou', 'meaning_thai' => 'เท้า', 'description_thai' => null, 'meaning_english' => 'foot', 'description_english' => null],
            ['radical' => '身', 'pinyin' => 'shēn', 'pinyin_eng' => 'zu', 'meaning_thai' => 'ร่างกาย', 'description_thai' => null, 'meaning_english' => 'body', 'description_english' => null],
            ['radical' => '车 (車)', 'pinyin' => 'chē', 'pinyin_eng' => 'shen', 'meaning_thai' => 'รถ', 'description_thai' => null, 'meaning_english' => 'cart', 'description_english' => null],
            ['radical' => '辛', 'pinyin' => 'xīn', 'pinyin_eng' => 'che', 'meaning_thai' => 'เผ็ด', 'description_thai' => null, 'meaning_english' => 'bitter', 'description_english' => null],
            ['radical' => '辰', 'pinyin' => 'chén', 'pinyin_eng' => 'xin', 'meaning_thai' => 'มังกร', 'description_thai' => null, 'meaning_english' => 'morning', 'description_english' => null],
            ['radical' => '辵 (辶,⻌,⻍)', 'pinyin' => 'chuò', 'pinyin_eng' => 'chen', 'meaning_thai' => 'เดิน', 'description_thai' => null, 'meaning_english' => 'walk', 'description_english' => null],
            ['radical' => '邑 (阝)', 'pinyin' => 'yì', 'pinyin_eng' => 'chuo', 'meaning_thai' => 'เมือง', 'description_thai' => null, 'meaning_english' => 'city', 'description_english' => null],
            ['radical' => '酉', 'pinyin' => 'yǒu', 'pinyin_eng' => 'yi', 'meaning_thai' => 'ไหเหล้า', 'description_thai' => null, 'meaning_english' => 'wine', 'description_english' => null],
            ['radical' => '釆', 'pinyin' => 'biàn', 'pinyin_eng' => 'you', 'meaning_thai' => 'แยกแยะ', 'description_thai' => null, 'meaning_english' => 'distinguish', 'description_english' => null],
            ['radical' => '里', 'pinyin' => 'lǐ', 'pinyin_eng' => 'bian', 'meaning_thai' => 'หมู่บ้าน', 'description_thai' => null, 'meaning_english' => 'village', 'description_english' => null],
            ['radical' => '金 (釒,钅)', 'pinyin' => 'jīn', 'pinyin_eng' => 'li', 'meaning_thai' => 'ทอง', 'description_thai' => null, 'meaning_english' => 'gold', 'description_english' => null],
            ['radical' => '長 (长,镸)', 'pinyin' => 'cháng', 'pinyin_eng' => 'jin', 'meaning_thai' => 'ยาว', 'description_thai' => null, 'meaning_english' => 'long', 'description_english' => null],
            ['radical' => '门 (門)', 'pinyin' => 'mén', 'pinyin_eng' => 'chang', 'meaning_thai' => 'ประตู', 'description_thai' => null, 'meaning_english' => 'gate', 'description_english' => null],
            ['radical' => '阜 (阝)', 'pinyin' => 'fù', 'pinyin_eng' => 'men', 'meaning_thai' => 'เนิน', 'description_thai' => null, 'meaning_english' => 'mound', 'description_english' => null],
            ['radical' => '隶', 'pinyin' => 'dài', 'pinyin_eng' => 'fu', 'meaning_thai' => 'เชื่อม', 'description_thai' => null, 'meaning_english' => 'slave', 'description_english' => null],
            ['radical' => '隹', 'pinyin' => 'zhuī', 'pinyin_eng' => 'dai', 'meaning_thai' => 'นกสั้น', 'description_thai' => null, 'meaning_english' => 'short-tailed bird', 'description_english' => null],
            ['radical' => '雨', 'pinyin' => 'yǔ', 'pinyin_eng' => 'zhui', 'meaning_thai' => 'ฝน', 'description_thai' => null, 'meaning_english' => 'rain', 'description_english' => null],
            ['radical' => '青 (靑)', 'pinyin' => 'qīng', 'pinyin_eng' => 'yu', 'meaning_thai' => 'ฟ้า, เขียว', 'description_thai' => null, 'meaning_english' => 'blue, green', 'description_english' => null],
            ['radical' => '非', 'pinyin' => 'fēi', 'pinyin_eng' => 'qing', 'meaning_thai' => 'ไม่ใช่', 'description_thai' => null, 'meaning_english' => 'wrong', 'description_english' => null],
            ['radical' => '面 (靣)', 'pinyin' => 'miàn', 'pinyin_eng' => 'fei', 'meaning_thai' => 'หน้า', 'description_thai' => null, 'meaning_english' => 'face', 'description_english' => null],
            ['radical' => '革', 'pinyin' => 'gé', 'pinyin_eng' => 'mian', 'meaning_thai' => 'หนัง', 'description_thai' => null, 'meaning_english' => 'leather', 'description_english' => null],
            ['radical' => '韋', 'pinyin' => 'wéi', 'pinyin_eng' => 'ge', 'meaning_thai' => 'หนัง', 'description_thai' => null, 'meaning_english' => 'tanned leather', 'description_english' => null],
            ['radical' => '韭', 'pinyin' => 'jiǔ', 'pinyin_eng' => 'wei', 'meaning_thai' => 'ต้นหอม', 'description_thai' => null, 'meaning_english' => 'leek', 'description_english' => null],
            ['radical' => '音', 'pinyin' => 'yīn', 'pinyin_eng' => 'jiu', 'meaning_thai' => 'เสียง', 'description_thai' => null, 'meaning_english' => 'sound', 'description_english' => null],
            ['radical' => '页 (頁)', 'pinyin' => 'yè', 'pinyin_eng' => 'yin', 'meaning_thai' => 'หน้าหนังสือ', 'description_thai' => null, 'meaning_english' => 'page', 'description_english' => null],
            ['radical' => '風', 'pinyin' => 'fēng', 'pinyin_eng' => 'ye', 'meaning_thai' => 'ลม', 'description_thai' => null, 'meaning_english' => 'wind', 'description_english' => null],
            ['radical' => '飞 (飛)', 'pinyin' => 'fēi', 'pinyin_eng' => 'feng', 'meaning_thai' => 'บิน', 'description_thai' => null, 'meaning_english' => 'fly', 'description_english' => null],
            ['radical' => '食 (飠,饣)', 'pinyin' => 'shí', 'pinyin_eng' => 'fei', 'meaning_thai' => 'กิน', 'description_thai' => null, 'meaning_english' => 'eat', 'description_english' => null],
            ['radical' => '首', 'pinyin' => 'shǒu', 'pinyin_eng' => 'shi', 'meaning_thai' => 'หัว', 'description_thai' => null, 'meaning_english' => 'head', 'description_english' => null],
            ['radical' => '香', 'pinyin' => 'xiāng', 'pinyin_eng' => 'shou', 'meaning_thai' => 'หอม', 'description_thai' => null, 'meaning_english' => 'fragrant', 'description_english' => null],
            ['radical' => '马 (馬)', 'pinyin' => 'mǎ', 'pinyin_eng' => 'xiang', 'meaning_thai' => 'ม้า', 'description_thai' => null, 'meaning_english' => 'horse', 'description_english' => null],
            ['radical' => '骨', 'pinyin' => 'gǔ', 'pinyin_eng' => 'ma', 'meaning_thai' => 'กระดูก', 'description_thai' => null, 'meaning_english' => 'bone', 'description_english' => null],
            ['radical' => '高 (髙)', 'pinyin' => 'gāo', 'pinyin_eng' => 'gu', 'meaning_thai' => 'สูง', 'description_thai' => null, 'meaning_english' => 'tall', 'description_english' => null],
            ['radical' => '髟', 'pinyin' => 'biāo', 'pinyin_eng' => 'gao', 'meaning_thai' => 'เส้นผมยาว', 'description_thai' => null, 'meaning_english' => 'long hair', 'description_english' => null],
            ['radical' => '鬥', 'pinyin' => 'dòu', 'pinyin_eng' => 'biao', 'meaning_thai' => 'สู้', 'description_thai' => null, 'meaning_english' => 'fight', 'description_english' => null],
            ['radical' => '鬯', 'pinyin' => 'chàng', 'pinyin_eng' => 'dou', 'meaning_thai' => 'ข้าวหมัก', 'description_thai' => null, 'meaning_english' => 'sacrificial wine', 'description_english' => null],
            ['radical' => '鬲', 'pinyin' => 'gé', 'pinyin_eng' => 'chang', 'meaning_thai' => 'หม้อสามขา', 'description_thai' => null, 'meaning_english' => 'cauldron', 'description_english' => null],
            ['radical' => '鬼', 'pinyin' => 'guǐ', 'pinyin_eng' => 'ge', 'meaning_thai' => 'ผี', 'description_thai' => null, 'meaning_english' => 'ghost', 'description_english' => null],
            ['radical' => '鱼 (魚)', 'pinyin' => 'yú', 'pinyin_eng' => 'gui', 'meaning_thai' => 'ปลา', 'description_thai' => null, 'meaning_english' => 'fish', 'description_english' => null],
            ['radical' => '鸟 (鳥)', 'pinyin' => 'niǎo', 'pinyin_eng' => 'yu', 'meaning_thai' => 'นก', 'description_thai' => null, 'meaning_english' => 'bird', 'description_english' => null],
            ['radical' => '鹿', 'pinyin' => 'lù', 'pinyin_eng' => 'niao', 'meaning_thai' => 'กวาง', 'description_thai' => null, 'meaning_english' => 'deer', 'description_english' => null],
            ['radical' => '麥', 'pinyin' => 'mài', 'pinyin_eng' => 'lu', 'meaning_thai' => 'ข้าวสาลี', 'description_thai' => null, 'meaning_english' => 'wheat', 'description_english' => null],
            ['radical' => '麻', 'pinyin' => 'má', 'pinyin_eng' => 'mai', 'meaning_thai' => 'กัญชา', 'description_thai' => null, 'meaning_english' => 'hemp', 'description_english' => null],
            ['radical' => '黃', 'pinyin' => 'huáng', 'pinyin_eng' => 'ma', 'meaning_thai' => 'เหลือง', 'description_thai' => null, 'meaning_english' => 'yellow', 'description_english' => null],
            ['radical' => '黍', 'pinyin' => 'shǔ', 'pinyin_eng' => 'huang', 'meaning_thai' => 'ข้าวเหนียว', 'description_thai' => null, 'meaning_english' => 'millet', 'description_english' => null],
            ['radical' => '黑', 'pinyin' => 'hēi', 'pinyin_eng' => 'shu', 'meaning_thai' => 'ดำ', 'description_thai' => null, 'meaning_english' => 'black', 'description_english' => null],
            ['radical' => '黹', 'pinyin' => 'zhǐ', 'pinyin_eng' => 'hei', 'meaning_thai' => 'เย็บปัก', 'description_thai' => null, 'meaning_english' => 'embroidery', 'description_english' => null],
            ['radical' => '黽', 'pinyin' => 'mǐn', 'pinyin_eng' => 'zhi', 'meaning_thai' => 'กบ', 'description_thai' => null, 'meaning_english' => 'frog', 'description_english' => null],
            ['radical' => '鼎', 'pinyin' => 'dǐng', 'pinyin_eng' => 'min', 'meaning_thai' => 'กระถางสามขา', 'description_thai' => null, 'meaning_english' => 'tripod', 'description_english' => null],
            ['radical' => '鼓', 'pinyin' => 'gǔ', 'pinyin_eng' => 'ding', 'meaning_thai' => 'กลอง', 'description_thai' => null, 'meaning_english' => 'drum', 'description_english' => null],
            ['radical' => '鼠', 'pinyin' => 'shǔ', 'pinyin_eng' => 'gu', 'meaning_thai' => 'หนู', 'description_thai' => null, 'meaning_english' => 'rat', 'description_english' => null],
            ['radical' => '鼻', 'pinyin' => 'bí', 'pinyin_eng' => 'shu', 'meaning_thai' => 'จมูก', 'description_thai' => null, 'meaning_english' => 'nose', 'description_english' => null],
            ['radical' => '齊', 'pinyin' => 'qí', 'pinyin_eng' => 'bi', 'meaning_thai' => 'พร้อมเพรียง', 'description_thai' => null, 'meaning_english' => 'even', 'description_english' => null],
            ['radical' => '齒', 'pinyin' => 'chǐ', 'pinyin_eng' => 'qi', 'meaning_thai' => 'ฟัน', 'description_thai' => null, 'meaning_english' => 'tooth', 'description_english' => null],
            ['radical' => '龍', 'pinyin' => 'lóng', 'pinyin_eng' => 'chi', 'meaning_thai' => 'มังกร', 'description_thai' => null, 'meaning_english' => 'dragon', 'description_english' => null],
            ['radical' => '龜', 'pinyin' => 'guī', 'pinyin_eng' => 'long', 'meaning_thai' => 'เต่า', 'description_thai' => null, 'meaning_english' => 'turtle', 'description_english' => null],
            ['radical' => '龠', 'pinyin' => 'yuè', 'pinyin_eng' => 'gui', 'meaning_thai' => 'ขลุ่ย', 'description_thai' => null, 'meaning_english' => 'flute', 'description_english' => null],
            ['radical' => '黎', 'pinyin' => 'lí', 'pinyin_eng' => 'yue', 'meaning_thai' => 'ข้าวหอม', 'description_thai' => null, 'meaning_english' => 'black millet', 'description_english' => null],
        ]);
    }
}

// 1-200
// please give me this each character in table format number, character, pinyin, pinyin_eng, radical,  english translate, thai translate for these Chinese characters which pinyin_eng mean pinyin that have no tone sign

// 乂 乜 亍 兀 弋 彳 丫 巳 孑 孓 幺 亓 韦 廿 卅 仄 厄 曰 壬 仃 仉 仂 兮 刈 爻 殳 卞 亢 闩 讣 尹 夬 爿 毋 邗 戋 卉 邛 艽 艿 札 叵 匝 丕 戊 匜 劢 卟 叱 叩 叻 冉 氕 仨 仕 仟 仡 仫 伋 仞 卮 氐 犰 卯 刍 庀 邝 邙 汀 汈 忉 宄 讦 讧 讪 讫 尻 弗 弘 阢 阡 尕 弁 驭 匡 耒 玎 玑 戎 圩 圬 圭 扦 圪 圳 圹 扪 圯 圮 芏 芊 芨 芄 芎 芑 芗 亘 厍 戌 夼 戍 尥 尧 乩 旯 曳 岌 屺 凼 囝 囡 钆 钇 缶 氘 氖 牝 伎 伛 伢 仳 佤 仵 伥 伧 伉 伫 囟 甪 汆 氽 刖 夙 旮 犴 刎 犷 犸 舛 邬 饧 冱 邡 汕 汔 汲 汐 汜 汝 汊 忖 忏 讴 讵 祁 讷 聿 艮 厾 阮 阪 丞 妁 妃 牟 纡 纣 纥 纨 纩 玕 玙 玚 抟 抔 坜 圻 坂 扺 坍 抃 抉 毐 芫 邯 芸 芾 芰 苈 苊

// 201-400
// please give me this each character in table format number, character, pinyin, pinyin_eng, radical,  english translate, thai translate for these Chinese characters which pinyin_eng mean pinyin that have no tone sign

// 苣 芷 芮 苋 芼 苌 苁 芩 芪 芴 芡 芟 苄 苎 苡 杌 杓 杧 杞 忑 孛 吾 邴 酉 邳 矶 奁 豕 忒 欤 轪 轫 迓 邶 忐 芈 卣 邺 旰 呋 呓 呔 呖 呃 旸 吡 町 虬 呙 呗 吣 吲 岍 帏 岐 岈 岘 岑 岚 兕 囵 囫 钊 钋 钌 迕 氙 氚 岙 佞 邱 佐 伾 攸 佚 佝 佟 佗 伽 彷 佘 佥 孚 豸 坌 肟 邸 奂 劬 狄 狃 狁 邹 饨 饩 饫 饬 亨 庑 庋 疔 疖 肓 闱 闳 闵 闶 羌 炀 沣 沅 沄 沔 沤 沌 沘 沏 沚 汩 汨 汭 沂 汾 沨 汴 汶 沆 沩 沁 泐 怃 忮 怄 忡 忤 忾 怅 忻 忪 怆 忭 忸 诂 诃 祀 祃 诋 诌 诎 诏 诐 诒 屃 孜 陇 阽 阼 陀 陂 陉 妍 妩 妪 妣 妊 妗 妫 妞 姒 妤 邵 劭 刭 甬 邰 矣 纭 纰 纴 纶 纻 纾 玮 玡 玠 玢 玥 玦 甙 盂 忝 匦 邽 坩 垅 抨 拤 拈 坫 垆

// 401-600
// please give me this each character in table format number, character, pinyin, pinyin_eng, radical,  english translate, thai translate for these Chinese characters which pinyin_eng mean pinyin that have no tone sign

// 抻 拃 拊 坼 拎 坻 坨 坭 抿 拚 坳 耵 耶 苷 苯 苤 茏 苴 苜 苒 苘 茌 苻 苓 茚 茆 茑 苑 茓 茔 茕 苠 茀 苕 枥 枇 杪 杳 枘 枧 杵 枨 枞 枋 杻 杷 杼 矸 矻 矽 砀 刳 瓯 殁 郏 轭 郅 鸢 盱 昊 杲 昃 咂 呸 昕 昀 旻 昉 炅 咔 畀 虮 迪 呷 黾 呱 呤 咚 咛 咄 呶 呦 咝 岵 岢 岿 岬 岫 帙 岣 峁 刿 峂 迥 岷 剀 帔 峄 沓 囹 罔 钍 钎 钏 钐 钒 钔 钕 钗 邾 迭 迮 牦 竺 迤 佶 佬 佴 侑 佰 侉 臾 岱 侗 侏 侩 佻 佾 侪 佼 佯 侬 帛 阜 侔 郈 徂 郐 郄 怂 籴 戗 肼 朊 肽 肱 肫 肭 肷 剁 迩 郇 狉 狙 狎 狝 狍 狒 咎 炙 枭 饯 饳 饴 冽 冼 庖 疠 疝 疡 兖 庚 妾 於 劾 炜 炖 炝 炔 泔 沭 泷 泸 泱 泅 泗 泠 泜 泺 泃 泖 泫 泮 沱 泯 泓 泾 怙 怵 怦

// 601-800
// please give me this each character in table format number, character, pinyin, pinyin_eng, radical,  english translate, thai translate for these Chinese characters which pinyin_eng mean pinyin that have no tone sign

// 怛 怏 怍 怩 怫 怊 怿 怡 宕 穸 穹 宓 诓 诔 诖 诘 戾 诙 戽 郓 祆 祎 祉 诛 诜 诟 诠 诣 诤 诨 诩 鸤 戕 孢 亟 陔 卺 妲 妯 姗 妮 帑 弩 孥 驽 迦 迢 迨 绀 绁 绂 驵 驷 驸 绉 驺 绋 绌 驿 骀 甾 砉 耔 珏 珐 珂 珑 玳 珀 顸 珉 珈 韨 拮 垭 挝 垣 垯 挞 垤 赳 贲 垱 垌 哉 垲 挢 埏 郝 垍 垧 垓 垟 垞 挦 垠 拶 茜 荙 荑 贳 荛 荜 茈 茼 莒 茱 莛 茯 荏 荇 荃 荟 荀 茗 茭 茨 垩 茳 荥 荦 荨 茛 荩 荪 荫 茹 荬 荭 柰 栉 柯 柘 栊 柩 枰 栌 柙 枵 柚 枳 柞 柝 栀 柃 柢 栎 枸 柈 柁 柽 剌 郚 剅 酊 郦 砗 砑 砘 砒 斫 砭 砜 奎 耷 虺 殂 殇 殄 殆 轱 轲 轳 轵 轶 轷 轸 轹 轺 虿 毖 觇 尜 哐 眄 眍 郢 眇 眊 昽 眈 咭 禺 哂 咴 曷 昴 昱 咦 哓

// 801-1000
// please give me this each character in table format number, character, pinyin, pinyin_eng, radical,  english translate, thai translate for these Chinese characters which pinyin_eng mean pinyin that have no tone sign

// 哔 畎 毗 呲 胄 畋 畈 虼 虻 咣 哕 剐 郧 咻 囿 咿 哌 哙 哚 咯 咩 咤 哝 哏 哞 峙 峣 罘 帧 峒 峤 峋 峥 峧 帡 贶 贻 钘 钚 钛 钡 钣 钤 钨 钪 钫 钬 钭 钯 矧 氡 氟 牯 郜 秭 竽 笈 笃 俦 俨 俅 俪 叟 垡 牮 俣 俚 俜 皈 禹 俑 俟 逅 徇 徉 舢 舣 俞 弇 郗 俎 卻 爰 郛 瓴 胨 胩 胪 胛 胂 胙 胍 胗 胝 朐 胫 鸨 匍 狨 狯 飐 飑 狩 狲 訇 訄 逄 昝 饷 饸 饹 饻 胤 孪 娈 庤 弈 庥 疬 疣 疥 疭 疢 庠 竑 彦 闼 闾 闿 羑 籼 酋 兹 炳 炻 炟 炽 炯 烀 炷 烃 洱 洹 洧 洌 浃 泚 浈 浉 洇 洄 洙 洑 洎 洫 浍 洮 洵 洚 洺 洨 浐 洴 洣 浒 浔 浕 洳 恸 恹 恫 恺 恻 恂 恪 恽 宥 宬 窀 扃 袆 衲 衽 衿 袂 祛 祜 祓 祚 诮 祗 祢 诰 诳 鸩 昶 郡 咫 弭 牁

// 1001-1200
// please give me this each character in table format number, character, pinyin, pinyin_eng, radical,  english translate, thai translate for these Chinese characters which pinyin_eng mean pinyin that have no tone sign

// 胥陛陟陧姞娅娆姝姽姣姘姹怼羿炱癸矜绔骁骅绗绚彖绛骈耖挈恝珥珙顼珰珽珩珧珣珞琤珲敖恚埔埕埘埚埙挹耆耄捋埒贽垸捃盍莰茝莆莳莴莪莠莓莜莅荼莶莩荽莸荻莘莎莞莨莙鸪莼栲栳郴桓桡桎桢桄桤梃栝桕桁桧栒栟桉栩逑逋彧鬲豇酐酎酏逦厝孬砝砹砺砧砷砟砼砥砣硁恧剞砻轼轾辀辁辂鸫趸剕龀鸬虔逍眬唛晟眩眙唝哧哳哽唔晔晁晏晖鸮趵趿畛蚨蚍蚋蚬蚝蚧唢圄唣唏盎唑帱崂崃罡罟峨峪觊赅赆钰钲钴钵钷钹钺钼钽钿铀铂铄铈铉铊铋铌铍铎眚氩氤氦毪舐秣盉

// number 1201-1400
// please give me this each character in table format (number, character, pinyin, pinyin_eng, radical,  english translate, thai translate) for these Chinese characters which pinyin_eng mean pinyin that have no tone sign

// 笄笕笊笫笏俸倩俵倻偌俳俶倬倏恁倭倪俾倜隼隽倞倓倌倥臬皋郫倨衄颀徕舨舫瓞釜奚鬯衾鸰胱胴胭脍脎胲胼朕脒胺鸱玺鱽鸲狴狷猁狳猃狺逖狻桀袅眢饽馀凇栾挛勍亳疳疴疽疸痄痈疱疰痃痂痉衮凋颃恣旆旄旃阃阄阆恙桊敉粑朔郸烜烨烩烊剡郯烬浡涑浯涞涟娑涅涠浞涓涢浥涔浜浠浼浣涘浚悖悚悭悝悃悒悌悢悛宸窅窈剜诹扅诼冢袪袗袢袯祯祧冥诿谀谂谄谇屐屙陬勐奘疍牂蚩陲陴烝姬娠娌娉娟娲娥娴娣娓婀砮哿畚逡剟绠骊绡骋绤绥绦骍绨骎邕鸶彗耜焘舂琎琏琇

// number 1401-1600
// please give me this each character in table format (number, character, pinyin, pinyin_eng, radical,  english translate, thai translate) for these Chinese characters which pinyin_eng mean pinyin that have no tone sign

// 掭揶埴掎埼埯捯焉掳掴埸堌赧捭晢逵埝堋堍掬鸷掊堉捩掮悫埭埽掇掼聃聆聍菁菝萁菥菘堇萘萋勩菽菖萜萸萑菂棻菔菟萏萃菼菏菹菪菅菀萦菰菡梽梵梾梏觋桴桷梓棁桫棂郾匮敕豉鄄酞酚厣戛硎硭硒硖硗硐硚硇硌鸸瓠匏厩龚殒殓殍赉雩辄堑龁眭唪眦啧晡眺眵眸圊啪喏喵啉勖晞晗啭趼趺啮跄蚶蛄蛎蚰蚺蛊圉蚱蛏蚴鄂啁啕唿啐唼唷啴啖啵啶啷唳啜帻崦帼崮帷崟崤崞崆崛赇赈铑铒铕铗铘铙铚铞铟铠铢铤铥铧铨铩铪铫铬铮铯铰铱铳铴铵铷氪牾鸹稆秾逶笺筇笸笪笮笱

// number 1601-1800
// please give me this each character in table format (number, character, pinyin, pinyin_eng, radical,  english translate, thai translate) for these Chinese characters which pinyin_eng mean pinyin that have no tone sign

// 笠笥笳笾笞偾鸺偃偕偈偲偬偻皑皎鸻徜舸舻舳舴鸼龛瓻豚脶脞脬脘脲脧匐鱾猗猡猊猞猄猝斛觖猕馗馃馄鸾孰庹庼庾庳痔痍疵翊旌旎袤阇阈阉阊阋阌阍阏羚羝羟粝粕焐烯焓烽焖烷烺焌渍渚淇淅淞渎涿淖挲淏淠涸渑淦淝淬涪淙涫渌淄惬悻悱惝惘悸惟惆惚惇寅逭窕谌谏扈皲谑袼裈裉祲谔谕谖谗谙谛谝敝逯艴隋郿隈粜隍隗婧婊婞婳婕娼婢婵胬袈翌恿欸绫骐绮绯骒绲骓绶绹绺绻绾骖缁耠琫琵琶琪瑛琦琥琨靓琰琮琯琬琛琚辇鼋揳堞搽塃揸揠堙趄揾颉塄揿堠耋揄蛰蛩

// number 1801-2000
// please give me this each character in table format (number, character, pinyin, pinyin_eng, radical,  english translate, thai translate) for these Chinese characters which pinyin_eng mean pinyin that have no tone sign

// 絷塆揞揎摒揆掾葜聒葑葚靰靸葳蒇蒈葺蒉葸萼蓇萩葆葩葶蒌葓蒎萱葖戟葭楮棼椟棹椤棰椑鹀赍椋椁棬楗棣椐鹁覃酤酢酡酦鹂觌硪硷厥殚殛雯辊辋椠辌辍辎斐黹牚睐睑睇睃戢喋嗒喃喱喹晷喈跖跗跞跚跎跏跆蛱蛲蛭蛳蛐蛞蛴蛟蛘蛑畯喁喟斝啾嗖喤喑嗟喽嗞喀喔喙嵘嵖崴遄詈嵎崽嵚嵬嵛翙嵯嵝嵫幄嵋赑铹铻铼铽铿锃锂锆锇锊锎锏锑锒锓锔锕掣矬氰毳毽犊犄犋鹄犍颋嵇稃稂筘筚筜筅筵筌傣傈舄傥傧遑皓皖傩遁徨舾畲弑颌翕釉鹆舜貂腈腓腆腴腑腙腚腱腒鱿鲀鲂鲃

// number 2001-2200
// please give me this each character in table format (number, character, pinyin, pinyin_eng, radical,  english translate, thai translate) for these Chinese characters which pinyin_eng mean pinyin that have no tone sign

// 颍猢猹猥飓觞觚猸猱飧馇馉馊亵脔裒廋斌痣痨痦痞痤痫痧鄌赓竦瓿啻颏鹇阑阒阕粞遒孳焯焜焱鹈湛渫湮湎湝湨湜渭湍湫溲湟溆渝湲溠溇湔湉渲渥湄滁愠惺愦惴愀愎愔喾寐谟扉棨扊裢裎裣裥祾祺祼谠禅禄幂谡谥谧塈遐孱弼巽骘媪媛婷巯毵翚皴婺骛缂缃缄彘缇缈缌缏缑缒缗骙飨耢瑚瑁瑀瑜瑗瑄瑕遨骜瑙遘韫髡塥塬鄢趔趑摅摁赪塮蜇搋搒搐搛搠摈彀毂搌搦搡蓁戡蓍鄞靳蓐蓦鹋蒽蓓蓊蒯蓟蓑蒺蓠蒟蒡蒹蒴蒗蓂蓥颐蓣楠楂楝楫榀楸椴槌楯榇榈槎榉楦楹椽裘剽甄酮

// number 2201-2400
// please give me this each character in table format (number, character, pinyin, pinyin_eng, radical,  english translate, thai translate) for these Chinese characters which pinyin_eng mean pinyin that have no tone sign

// 酰酯酩蜃碛碓碚碇碜鹌辏辒龃龅龆觜訾粲虞睚嗪睫韪嗷嗉睨睢雎睥嘟嗑嗫嗬嗔嗝戥嗄煦暅遢暌跬跶跸跐跣跹跻跤蛸蜎蜊蜍蜉蜣畹嗣嗥嗲嗳嗌嗍嗵罨嵊嵩嵴骰锖锗锘锛锜锝锞锟锢锧锪锫锩锬锱雉氲犏歃稞稗稔筠筢筮筻筲筼筱牒煲鹎敫僇徭愆艄觎毹貊貅貉颔腠腩腼腽腭腧塍媵詹鲅鲆鲇鲈鲉鲊稣鲋鲌鲍鲏鲐鹐飔飕觥遛馌馐鹑亶廒瘃痱痼痿瘐瘁瘅瘆鄘麂鄣歆旒雍阖阗阘阙羧豢粳猷煳煜煨煅煊煸煺滟溱溘滠漭滢滇溥溧溽裟溻溷溦滗滫溴滏滃滦溏滂溟滘滍滪愫慑慥

// number 2401-2600
// please give me this each character in table format (number, character, pinyin, pinyin_eng, radical,  english translate, thai translate) for these Chinese characters which pinyin_eng mean pinyin that have no tone sign

// 慊鲎骞窦窠窣裱褚裼裨裾裰禊谩谪谫媾嫫媲嫒嫔媸缙缜缛辔骝缟缡缢缣骟耥璈瑶瑭瑢獒觏慝嫠韬墈摽墁撂摞撄翥踅銎摭墉墒榖撖摺綦蔷靺靼鞅靽鞁靿蔌甍蔸蓰蔹蔡蔟蔺戬蕖蔻蓿斡鹕嘏蓼榧槚槛榻榫槜榭槔槁槟槠榷榍僰酽酾酲酶酴酹厮碶碡碣碲碹碥劂臧豨殡霆霁辗蜚裴翡龇龈睿夥瞅瞍睽嘞嘌嘎暝踌踉跽蜞蜥蜮蜾蝈蜴蜱蜩蜷蜿螂蜢嘘嘡鹗嘣嘤嘚嗾嘧罴罱嶂幛赙罂骷骶鹘锴锶锷锸锽锾锵锿镁镂镃镄镅犒箐箦箧箸箨箬箅箪箔箜箢箓毓僖儆僳僭僬劁僦僮魃魆睾艋

// number 2601-2800
// please give me this each character in table format (number, character, pinyin, pinyin_eng, radical,  english translate, thai translate) for these Chinese characters which pinyin_eng mean pinyin that have no tone sign

// 鄱膈膑鲑鲔鲙鲚鲛鲟獐獍飗觫雒夤馑銮塾麽廙瘌瘗瘊瘥瘘瘙廖韶旖膂阚鄯鲞粼粽糁槊鹚熘煽熥潢潆漤漕滹漯漶潋潴漪漉漳澉潍慵搴窬窨窭寤肇綮谮褡褙褓褛褊禚谯谰谲暨屣鹛嫣嫱嫖嫦嫚嫘嫜嫪鼐翟瞀鹜骠缥缦缧骢缪缫耦耧瑾璜璀璎璁璋璇璆奭髯髫撷撅赭墦撸鋆撙撺墀聩觐鞑蕙鞒蕈蕨蕤蕞蕺瞢劐蕃蕲蕰赜鼒槿樯槭樗樘槲鹝醌醅靥魇餍磊磔磙磉殣慭霄霈辘龉龊觑瞌瞑嘻嘭噎噶颙暹踔踝踟踬踮踣踯踺踞蝽蝾蝻蝰蝮螋蝓蝣蝼蝤噗嘬颚噍噢噙噜噌噀噔颛幞幡嶓嶙

// number 2801-3000
// please give me this each character in table format (number, character, pinyin, pinyin_eng, radical,  english translate, thai translate) for these Chinese characters which pinyin_eng mean pinyin that have no tone sign

// 嶝骺骼骸镆镈镉镋镌镍镎镏镑镒镓镔稷箴篑篁篌篆牖儇儋徵磐虢鹞鹟滕鲠鲡鲢鲣鲥鲦鲧鲩鲪鲬橥獗獠觯鹠馓馔麾廛瘛瘼瘢瘠齑鹡羯羰糇遴糌糍糈糅翦鹣熜熵熠澍澌潵潸鲨潲鋈潟潼潽潺潏憬憧寮窳谳褴褫禤谵屦勰戮蝥缬缮缯骣畿耩耨耪璞璟靛璠璘聱螯髻髭髹擀熹甏擐擞磬鄹颞蕻鞘黇颟薤薨檠薏蕹薮薜薅樾橛橇樵檎橹橦樽樨橼墼橐翮醛醐醍醚醑觱磺磲赝飙殪霖霏霓錾辚臻遽氅瞟瞠瞰嚄嚆噤暾曈蹀蹅踶踹踵踽蹉蹁螨蟒螈螅螭螗螠噱噬噫噻噼幪罹圜镖镗镘镚镛

// number 3001-3200
// please give me this each character in table format (number, character, pinyin, pinyin_eng, radical,  english translate, thai translate) for these Chinese characters which pinyin_eng mean pinyin that have no tone sign

// 镝镞镠氇氆憩穑穄篝篚篥簉篦篪盥劓翱魉魈徼歙盦膪螣膦膙鲭鲮鲯鲰鲱鲲鲳鲴鲵鲷鲺鲹鲻獴獭獬邂憝亸鹧廨赟癀瘭瘰廪瘿瘵瘴癃瘳斓麇麈嬴壅羲糗瞥甑燠燔燧燊燏濑濉潞澧澴澹澥澶濂澼憷黉褰寰窸褶禧嬖犟隰嬗鹨翯颡缱缲缳璨璩璐璪螫擤觳罄擢藉薹鞡薷薰藓藁檑檄懋醢翳繄礅磴鹩龋龌豳壑黻瞵嚅蹑蹒蹊蹓蹐螬螵疃螳蟑嚓羁罽罾嶷黜黝髁髀镡镢镤镥镦镧镨镩镪镫罅黏簧簌篾簃篼簏簖簋鼢黛鹪鼾皤魍艚龠繇貘邈貔臌膻臁臆臃鲼鲽鲾鳀鳁鳂鳃鳅鳆鳇鳈鳉鳊獯

// number 3201-3462
// please give me this each character in table format (number, character, pinyin, pinyin_eng, radical,  english translate, thai translate) for these Chinese characters which pinyin_eng mean pinyin that have no tone sign

// 螽燮鹫襄縻膺癍麋馘懑濡濮濞濠濯蹇謇邃襕襁檗甓擘孺隳嬷蟊鹬鍪鏊鳌鬹鬈鬃瞽鞯鞨鞫鞧鞣藜藠藩鹲檫檵醪蹙礞礓礌燹餮蹩瞿曛颢曜躇鹭蹢蹜蟛蟪蟠蟮嚚鹮黠黟髅髂镬镭镯镱馥簠簟簪簦鼫鼬鼩雠艟臑鳎鳏鳐鳑鹱癔癜癖糨冁瀍瀌鎏懵彝邋鬏攉鞲鞴藿蘧蘅麓醭醮醯礤酃霪霭黼嚯蹰蹶蹽蹼蹯蹴蹾蹿蠖蠓蠋蟾蠊巅黢髋髌镲籀籁鳘齁魑艨鼗鳓鳔鳕鳗鳙鳚麒鏖蠃羸瀚瀣瀛襦谶襞骥缵瓒馨蘩蘖蘘醵醴霰颥酆矍曦躅鼍巉黩黥镳镴黧纂鼯犨臜鳜鳝鳟獾瀹瀵孀骧耰瓘鼙醺礴礳颦曩黯鼱鳡鳢癫麝赣夔爝灏禳鐾羼蠡耲耱懿韂鹳糵蘼霾氍饕躔躐髑镵穰鳤饔鬻鬟趱攫攥颧躜鼹鼷癯麟蠲蠹醾躞衢鑫灞襻纛鬣攮囔馕戆蠼爨齉
