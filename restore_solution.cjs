const { MongoClient } = require('mongodb');
const uri = 'mongodb://127.0.0.1:27017/ula_landing-china';
const client = new MongoClient(uri);

async function run() {
  await client.connect();
  const db = client.db();
  const collection = db.collection('landingpages');
  
  const siteDoc = await collection.findOne({ site: 'tieng-duc', variant: 'default' });
  if (siteDoc) {
    const solution = siteDoc.sections.section_3_solution;
    if (solution && solution.length === 2) {
      console.log('Found only 2 items, updating to 3...');
      const defaultData = [
        {
          category: 'Coaching',
          title: 'Hiệu quả như gia sư 1 kèm 1',
          bullets: ['Video bài giảng cùng chuyên gia', 'Bắt đầu sớm từ lớp 10–11', 'Đội ngũ hỗ trợ 24/7'],
          mediaUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600',
          isVideo: false,
          gradient: 'from-indigo-600/40 to-blue-500/10',
        },
        {
          category: 'Practice',
          title: 'Luyện tập không giới hạn',
          bullets: ['Bài tập tương tác ngay trong video', 'AI luyện phát âm, phản xạ'],
          mediaUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600',
          isVideo: false,
          gradient: 'from-blue-400/20 to-white/5',
        },
        {
          category: 'Flexible',
          title: 'Học linh hoạt và tiết kiệm',
          bullets: ['Chỉ với 10k/ngày (giảm 80%)', 'Học mọi lúc với đa thiết bị'],
          mediaUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600',
          isVideo: false,
          gradient: 'from-blue-900/60 to-black/40',
        }
      ];
      await collection.updateOne(
        { site: 'tieng-duc', variant: 'default' },
        { $set: { 'sections.section_3_solution': defaultData } }
      );
      console.log('Successfully restored 3rd card!');
    } else {
      console.log('Data is not 2 items. It has', solution ? solution.length : 0);
    }
  } else {
    console.log('Site document not found.');
  }
  await client.close();
}
run().catch(console.error);
